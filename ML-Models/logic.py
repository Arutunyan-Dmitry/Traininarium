import pandas as pd
import joblib

FILENORM = "static/csv/heart_2020_normalized.csv"


def rule_prediction(heart_disease, diabetic, diabetic_diseased, diabetic_period,
                    kidney_disease, kidney_disease_chronic, cholesterol, ad):
    risk = [0.0 for _ in range(5)]
    if heart_disease != 'None':
        if heart_disease == '1':
            risk[0] = 0.7
        else:
            risk[0] = 0.1
    else:
        risk[0] = 0

    if diabetic != 'None':
        if diabetic == '1':
            if diabetic_diseased == '1':
                risk[1] = 0.7
            else:
                if diabetic_period > 20:
                    risk[1] = 0.7
                elif diabetic_period > 10:
                    risk[1] = 0.5
                else:
                    risk[1] = 0.3
        else:
            risk[1] = 0.1
    else:
        risk[1] = 0

    if kidney_disease != 'None':
        if kidney_disease == '1':
            if kidney_disease_chronic == '1':
                risk[2] = 0.7
            else:
                risk[2] = 0.5
        else:
            risk[2] = 0.1
    else:
        risk[2] = 0

    if cholesterol != 'None':
        if cholesterol == '1':
            risk[3] = 0.5
        else:
            risk[3] = 0.1
    else:
        risk[3] = 0

    if ad != 'None':
        if ad == '1':
            risk[4] = 0.5
        else:
            risk[4] = 0.1
    else:
        risk[4] = 0

    if risk.count(0) > 2:
        return 0
    else:
        return max(risk)


def neural_prediction(x_df):
    step_arr = [0, 0.2, 0.4, 0.6, 0.8, 1]
    ans = joblib.load('static/model/ans-stack.pkl')
    mlp = joblib.load('static/model/mlp-rg.pkl')
    y_class = ans.predict(x_df.values).astype(int)[0]
    y_reg = mlp.predict(x_df.values)[0]

    min_len = 1
    min_n = 0
    for j in range(len(step_arr)):
        if min_len > y_reg - step_arr[j] > 0:
            min_len = y_reg - step_arr[j]
            min_n = j
    if y_reg < y_class:
        if y_reg > (step_arr[min_n] + step_arr[min_n + 1]) / 2:
            y_reg = step_arr[min_n + 1]
        else:
            y_reg += (step_arr[min_n + 1] - step_arr[min_n]) / 2
    if y_reg > y_class:
        if y_reg < (step_arr[min_n] + step_arr[min_n + 1]) / 2:
            y_reg = step_arr[min_n]
        else:
            y_reg -= (step_arr[min_n + 1] - step_arr[min_n]) / 2

    return y_reg


def perform_prediction(heart_disease, diabetic, diabetic_diseased, diabetic_period,
                       kidney_disease, kidney_disease_chronic, cholesterol, ad,
                       bmi, smoking, alcohol, stroke, phys_h, ment_h, diff_walk,
                       sex, age, race, phys_a, gen_h, sleep, astma, skin):
    df = pd.read_csv(FILENORM, sep=',').drop(['HeartDisease'], axis=1)
    x_df = pd.DataFrame(columns=df.columns)
    if bmi == '' or phys_h == '' or ment_h == '' or sleep == '' or age == '':
        raise ValueError("Ошибка заполнения формы")
    x_df.at[0, 'BMI'] = float(bmi)
    x_df.at[0, 'PhysicalHealth'] = int(phys_h)
    x_df.at[0, 'MentalHealth'] = int(ment_h)
    x_df.at[0, 'SleepTime'] = int(sleep)

    if smoking is not None:
        x_df.at[0, 'Smoking_Yes'] = True
    if alcohol is not None:
        x_df.at[0, 'AlcoholDrinking_Yes'] = True
    if stroke is not None:
        x_df.at[0, 'Stroke_Yes'] = True
    if diff_walk is not None:
        x_df.at[0, 'DiffWalking_Yes'] = True
    if sex is not None:
        x_df.at[0, 'Sex_Male'] = True
    if phys_a is not None:
        x_df.at[0, 'PhysicalActivity_Yes'] = True
    if astma is not None:
        x_df.at[0, 'Asthma_Yes'] = True
    if skin is not None:
        x_df.at[0, 'SkinCancer_Yes'] = True

    race_columns = df.filter(like=race[0])
    x_df.at[0, race_columns.columns[0]] = True
    gen_h_columns = df.filter(like=gen_h[0])
    x_df.at[0, gen_h_columns.columns[0]] = True

    if int(age) <= 24:
        x_df.at[0, 'AgeCategory_18-24'] = True
    else:
        if int(age) >= 80:
            x_df.at[0, 'AgeCategory_80 or older'] = True
        else:
            if int(age) % 10 > 4:
                n_age = int(int(age) / 10) * 10 + 9
                age_columns = df.filter(like=str(n_age))
                x_df.at[0, age_columns.columns[0]] = True
            else:
                n_age = int(int(age) / 10) * 10
                age_columns = df.filter(like=str(n_age))
                x_df.at[0, age_columns.columns[0]] = True
    x_df = x_df.fillna(False)

    neural_p = neural_prediction(x_df=x_df)
    rule_p = rule_prediction(heart_disease, diabetic, diabetic_diseased, diabetic_period,
                             kidney_disease, kidney_disease_chronic, cholesterol, ad)

    if rule_p == 0:
        return neural_p
    else:
        return rule_p * 0.6 + neural_p * 0.4
