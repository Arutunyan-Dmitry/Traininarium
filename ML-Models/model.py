import numpy as np
from matplotlib import pyplot as plt
import pandas as pd
from sklearn import metrics
from sklearn.ensemble import BaggingRegressor, BaggingClassifier, AdaBoostClassifier, AdaBoostRegressor, \
    StackingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
import joblib
from sklearn.neural_network import MLPClassifier, MLPRegressor
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier

FILEDAMP = "static/csv/heart_2020_cleaned.csv"
FILEPREP = "static/csv/heart_2020_required.csv"
FILENORM = "static/csv/heart_2020_normalized.csv"


# ['White - European' 'Black - African' 'Asian' 'American Indian/Alaskan Native - American' 'Other' 'Hispanic - Indian']
def normalisation():
    df = pd.read_csv(FILEDAMP, sep=',').dropna()
    counts = df['HeartDisease'].value_counts()
    min_count = min(counts)
    df_balanced = df.groupby('HeartDisease').apply(lambda x: x.sample(n=min_count))
    df = df_balanced.reset_index(drop=True)

    df = df.drop(columns=['Diabetic', 'KidneyDisease', 'Stroke'])
    df['Race'] = df['Race'].replace({'White': 'European',
                                     'Black': 'African',
                                     'American Indian/Alaskan Native': 'American',
                                     'Hispanic': 'Indian'})
    df.to_csv(FILEPREP, index=False)

    non_binary_columns = df[['HeartDisease', 'BMI', 'PhysicalHealth', 'MentalHealth', 'SleepTime']]
    df = df.drop(columns=non_binary_columns.columns)
    df_norm = pd.DataFrame()
    for column in df.columns:
        binary_matrix = pd.get_dummies(df[column], prefix=column)
        df_norm = pd.concat([df_norm, binary_matrix], axis=1)
    for index, row in non_binary_columns.iterrows():
        if "Yes" in row["HeartDisease"]:
            non_binary_columns.at[index, 'HeartDisease'] = True
        else:
            non_binary_columns.at[index, 'HeartDisease'] = False
    df_norm.insert(0, non_binary_columns.columns[0], non_binary_columns['HeartDisease'].values)
    df_norm = pd.concat([df_norm, non_binary_columns[['BMI', 'PhysicalHealth', 'MentalHealth', 'SleepTime']]], axis=1)
    df_norm.to_csv(FILENORM, index=False)


def mlp_class():
    df = pd.read_csv(FILENORM, sep=',')
    x, y = [df.drop('HeartDisease', axis=1).values, df['HeartDisease'].values]
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.003, random_state=42)
    mlp = MLPClassifier(hidden_layer_sizes=(100, 50), max_iter=1000, activation='relu')
    mlp.fit(x_train, y_train)
    joblib.dump(mlp, 'static/model/mlp.pkl')
    y_predict = mlp.predict(x_test)
    err = pred_class_errors(y_predict.astype(int), y_test.astype(int))
    make_plots(y_test, y_predict, err[0], err[1], "MLP классификатор", 'mlp')


def mlp_regressor(): # фаворит
    df = pd.read_csv(FILENORM, sep=',')
    x, y = [df.drop('HeartDisease', axis=1).values, df['HeartDisease'].values]
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.003, random_state=42)
    mlp = MLPRegressor(hidden_layer_sizes=(100, 50), max_iter=1000, activation='logistic', solver='adam', random_state=42)
    mlp.fit(x_train, y_train)
    joblib.dump(mlp, 'static/model/mlp-rg.pkl')
    y_predict = mlp.predict(x_test)
    for i in range(len(y_predict)):
        if y_predict[i] < 0:
            y_predict[i] = 0
        if y_predict[i] > 1:
            y_predict[i] = 1
    err = pred_errors(y_predict, y_test)
    make_plots(y_test, y_predict, err[0], err[1], "MLP регрессор", 'mlp-rg')


def logistic_regression():
    df = pd.read_csv(FILENORM, sep=',')
    X, y = [df.drop("HeartDisease", axis=1).values,
            df["HeartDisease"].values]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.003, random_state=42)
    lg = LogisticRegression(max_iter=1000, random_state=42)
    lg.fit(X_train, y_train)
    y_predict = [row[1] for row in lg.predict_proba(X_test)]
    y_predict_1 = lg.predict(X_test)
    err = pred_class_errors(np.array(y_predict_1).astype(int), np.array(y_test).astype(int))
    make_plots(y_test, y_predict, err[0], err[1], "Логистическая регрессия", 'lg')


def ansambley_bagging():
    df = pd.read_csv(FILENORM, sep=',')
    X, y = [df.drop("HeartDisease", axis=1).values,
            df["HeartDisease"].values]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.003, random_state=42)
    model = BaggingClassifier(estimator=LogisticRegression(max_iter=1000),
                                n_estimators=50, random_state=42)
    model.fit(X_train, y_train)
    y_predict = model.predict(X_test)
    err = pred_class_errors(y_predict.astype(int), y_test.astype(int))
    make_plots(y_test, y_predict, err[0], err[1], "Ансамбль моделей (бэггинг лг)", 'lg-bag')


def ansambley_stacking(): # фаворит
    df = pd.read_csv(FILENORM, sep=',')
    X, y = [df.drop("HeartDisease", axis=1).values,
            df["HeartDisease"].values]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.003, random_state=42)
    estimators = [('lr', LogisticRegression(max_iter=1000)), ('dt', DecisionTreeClassifier())]
    model = StackingClassifier(estimators=estimators,
                               final_estimator=SVC())
    model.fit(X_train, y_train)
    joblib.dump(model, 'static/model/ans-stack.pkl')
    y_predict = model.predict(X_test)
    err = pred_class_errors(y_predict.astype(int), y_test.astype(int))
    make_plots(y_test, y_predict, err[0], err[1], "Ансамбль моделей (стекинг лг)", 'lg-stack')


def ansambley_boosting():
    df = pd.read_csv(FILENORM, sep=',')
    X, y = [df.drop("HeartDisease", axis=1).values,
            df["HeartDisease"].values]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.003, random_state=42)
    model = AdaBoostClassifier(estimator=LogisticRegression(max_iter=1000),
                                n_estimators=50, algorithm='SAMME', random_state=42)
    model.fit(X_train, y_train)
    y_predict = model.predict(X_test)
    err = pred_class_errors(y_predict.astype(int), y_test.astype(int))
    make_plots(y_test, y_predict, err[0], err[1], "Ансамбль моделей (бустинг лг)", 'lg-boost')


def coridor(): # ------------------------ фаворит
    step_arr = [0, 0.2, 0.4, 0.6, 0.8, 1]
    df = pd.read_csv(FILENORM, sep=',')
    X, y = [df.drop("HeartDisease", axis=1).values,
            df["HeartDisease"].values]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.003, random_state=42)
    ans = joblib.load('static/model/ans-stack.pkl')
    mlp = joblib.load('static/model/mlp-rg.pkl')
    y_class = ans.predict(X_test).astype(int)
    y_reg = mlp.predict(X_test)

    for i in range(len(y_class)):
        min_len = 1
        min_n = 0
        for j in range(len(step_arr)):
            if min_len > y_reg[i] - step_arr[j] > 0:
                min_len = y_reg[i] - step_arr[j]
                min_n = j
        if y_reg[i] < y_class[i]:
            if y_reg[i] > (step_arr[min_n] + step_arr[min_n + 1]) / 2:
                y_reg[i] = step_arr[min_n + 1]
            else:
                y_reg[i] += (step_arr[min_n + 1] - step_arr[min_n]) / 2
        if y_reg[i] > y_class[i]:
            if y_reg[i] < (step_arr[min_n] + step_arr[min_n + 1]) / 2:
                y_reg[i] = step_arr[min_n]
            else:
                y_reg[i] -= (step_arr[min_n + 1] - step_arr[min_n]) / 2

    err = pred_errors(y_reg, y_test)
    make_plots(y_test, y_reg, err[0], err[1], "Коридор (Stack + MLP)", 'mlp-stack-coridor')


def b_value():
    b = 0.1
    df = pd.read_csv(FILENORM, sep=',')
    X, y = [df.drop("HeartDisease", axis=1).values,
            df["HeartDisease"].values]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.003, random_state=42)
    ans = joblib.load('static/model/ans-stack.pkl')
    mlp = joblib.load('static/model/mlp-rg.pkl')
    y_class = ans.predict(X_test).astype(int)
    y_reg = mlp.predict(X_test)
    for i in range(len(y_class)):
        if y_reg[i] < y_class[i] and y_reg[i] < 0.9:
            y_reg[i] += b
        if y_reg[i] > y_class[i] and y_reg[i] > 0.1:
            y_reg[i] -= b
    err = pred_errors(y_reg, y_test)
    make_plots(y_test, y_reg, err[0], err[1], "Фиксированный сдвиг (Stack + MLP)", 'mlp-stack-value')


def mid_model():
    df = pd.read_csv(FILENORM, sep=',')
    X, y = [df.drop("HeartDisease", axis=1).values,
            df["HeartDisease"].values]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.003, random_state=42)
    ans = joblib.load('static/model/ans-stack.pkl')
    mlp = joblib.load('static/model/mlp-rg.pkl')
    y_class = ans.predict(X_test).astype(int)
    y_reg = mlp.predict(X_test)
    y_reg = (y_class + y_reg) / 2
    err = pred_errors(y_reg, y_test)
    make_plots(y_test, y_reg, err[0], err[1], "Усреднение значений (Stack + MLP)", 'mlp-stack-mid')


def koef():
    df = pd.read_csv(FILENORM, sep=',')
    X, y = [df.drop("HeartDisease", axis=1).values,
            df["HeartDisease"].values]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.003, random_state=42)
    ans = joblib.load('static/model/ans-stack.pkl')
    mlp = joblib.load('static/model/mlp-rg.pkl')
    y_class = ans.predict(X_test).astype(int)
    y_reg = mlp.predict(X_test)
    for i in range(len(y_class)):
        if y_class[i] - y_reg[i] > 0:
            y_reg[i] = 1 - (y_class[i] - y_reg[i]) * y_reg[i]
        if y_class[i] - y_reg[i] < 0:
            y_reg[i] = abs((y_class[i] - y_reg[i]) * y_reg[i])
    err = pred_errors(y_reg, y_test)
    make_plots(y_test, y_reg, err[0], err[1], "Коэфициент (Stack + MLP)", 'mlp-stack-kp')


# --------------------------------------------------------------------------------------------
def pred_errors(y_predict, y_test):
    mid_square = np.round(np.sqrt(metrics.mean_squared_error(y_test, y_predict)), 3)
    det_kp = np.round(metrics.r2_score(y_test, y_predict), 2)
    return mid_square, det_kp


def pred_class_errors(y_predict, y_test):
    mid_square = np.round(np.sqrt(metrics.mean_squared_error(y_test, y_predict)), 3)
    det_kp = np.round(metrics.accuracy_score(y_test, y_predict), 2)
    return mid_square, det_kp


def make_plots(y_test, y_predict, mid_sqrt, det_kp, title, filename):
    plt.plot(y_test, c="red", label="\"y\" исходная")
    plt.plot(y_predict, c="green", label="\"y\" предсказанная \n"
                                         "Ср^2 = " + str(mid_sqrt) + "\nКд = " + str(det_kp))
    plt.legend(loc='lower left')
    plt.title(title)
    plt.savefig('static/image/' + filename + '.png')
    plt.close()


if __name__ == '__main__':
    ansambley_stacking()
