import datetime
import pandas as pd
from matplotlib import pyplot as plt
from sklearn.model_selection import train_test_split

from django.test import TestCase

from health.services.prediction import Predictor
from traininarium.settings import BASE_DIR, STATIC_URL

CSV_PATH = str(BASE_DIR) + '/' + STATIC_URL + 'csv/test/heart_2020_normalized.csv'
CHARTS_DIR = str(BASE_DIR) + '/' + STATIC_URL + 'images/test/'

VERIFIED_RISK_RESPONDENTS = {
    'low-risk': {
        "date_of_birth": datetime.date(2000, 1, 1), "gender": "Male", "race": "European",
        "is_using_data_agreed": False, "height": 180, "is_heart_diseased": False,
        "is_diabetic": False, "is_diabetic_with_diseases": False, "diabetic_period": 0,
        "is_physical_activity": True, "is_kidney_diseased": False,"is_kidney_disease_chronic": False,
        "is_cholesterol": False, "is_stroked": False, "is_blood_pressure": False,
        "is_smoker": False, "is_alcoholic": False, "is_asthmatic": False, "is_skin_cancer": False,
        "weight": 80, "physical_health": 0, "mental_health": 0, "is_difficult_to_walk": False,
        "general_health": "Excellent", "sleep_time": 8
    },
    'medium-risk': {
        "date_of_birth": datetime.date(2000, 1, 1), "gender": "Male", "race": "European",
        "is_using_data_agreed": False, "height": 180, "is_heart_diseased": False,
        "is_diabetic": False, "is_diabetic_with_diseases": False, "diabetic_period": 0,
        "is_physical_activity": False, "is_kidney_diseased": False,"is_kidney_disease_chronic": False,
        "is_cholesterol": True, "is_stroked": False, "is_blood_pressure": True,
        "is_smoker": False, "is_alcoholic": False, "is_asthmatic": False, "is_skin_cancer": False,
        "weight": 80, "physical_health": 0, "mental_health": 0, "is_difficult_to_walk": False,
        "general_health": "Good", "sleep_time": 8
    },
    'high-risk': {
        "date_of_birth": datetime.date(1990, 1, 1), "gender": "Male", "race": "European",
        "is_using_data_agreed": False, "height": 180, "is_heart_diseased": False,
        "is_diabetic": True, "is_diabetic_with_diseases": True, "diabetic_period": 15,
        "is_physical_activity": False, "is_kidney_diseased": False,"is_kidney_disease_chronic": False,
        "is_cholesterol": True, "is_stroked": False, "is_blood_pressure": True,
        "is_smoker": False, "is_alcoholic": False, "is_asthmatic": False, "is_skin_cancer": False,
        "weight": 95, "physical_health": 15, "mental_health": 15, "is_difficult_to_walk": False,
        "general_health": "Fair", "sleep_time": 6
    },
    'very-high-risk': {
        "date_of_birth": datetime.date(1980, 1, 1), "gender": "Male", "race": "European",
        "is_using_data_agreed": False, "height": 180, "is_heart_diseased": False,
        "is_diabetic": True, "is_diabetic_with_diseases": False, "diabetic_period": 15,
        "is_physical_activity": False, "is_kidney_diseased": False, "is_kidney_disease_chronic": False,
        "is_cholesterol": True, "is_stroked": False, "is_blood_pressure": True,
        "is_smoker": True, "is_alcoholic": False, "is_asthmatic": True, "is_skin_cancer": False,
        "weight": 100, "physical_health": 20, "mental_health": 20, "is_difficult_to_walk": True,
        "general_health": "Poor", "sleep_time": 5
    },
    'the-highest-risk': {
        "date_of_birth": datetime.date(1960, 1, 1), "gender": "Male", "race": "European",
        "is_using_data_agreed": False, "height": 180, "is_heart_diseased": False,
        "is_diabetic": True, "is_diabetic_with_diseases": True, "diabetic_period": 25,
        "is_physical_activity": False, "is_kidney_diseased": True, "is_kidney_disease_chronic": True,
        "is_cholesterol": True, "is_stroked": False, "is_blood_pressure": True,
        "is_smoker": True, "is_alcoholic": True, "is_asthmatic": True, "is_skin_cancer": True,
        "weight": 180, "physical_health": 30, "mental_health": 30, "is_difficult_to_walk": True,
        "general_health": "Poor", "sleep_time": 4
    }
}
GROUPS_RISK_RANGE = {
    'low-risk': {'min': 0, 'max': 0.2},
    'medium-risk': {'min': 0.2, 'max': 0.4},
    'high-risk': {'min': 0.4, 'max': 0.6},
    'very-high-risk': {'min': 0.6, 'max': 0.8},
    'the-highest-risk': {'min': 0.8, 'max': 1},
}


class SurveyTestCase(TestCase):
    """
    Тестирование модуля выявления и прогнозирования заболеваний
    """
    def setUp(self):
        self.neural_prediction_errors()

    @staticmethod
    def _accuracy_score(test, result):
        got, miss = [0, 0]
        for i in range(len(test)):
            if (test[i] == 1 and result[i] >= 0.5) or (test[i] == 0 and result[i] <= 0.5):
                got += 1
            else:
                miss += 1
        return {'total': len(test), 'right': got, 'missed': miss}

    @staticmethod
    def _trend_score(test, result):
        got, miss = [0, 0]
        for i in range(len(test) - 1):
            if (test[i] >= test[i + 1] and result[i] >= result[i + 1]) or \
                    (test[i] <= test[i + 1] and result[i] <= result[i + 1]):
                got += 1
            else:
                miss += 1
        return {'total': len(test), 'right': got, 'missed': miss}

    @staticmethod
    def _make_plot(score, title):
        fig, ax = plt.subplots()
        wedges, texts, autotexts = ax.pie(
            [score.get('right'), score.get('missed')],
            labels=[''] * 2,
            colors=['#1E90FF', '#DC143C'],
            startangle=140,
            wedgeprops={'linewidth': 5, 'edgecolor': 'white'},
            autopct='%1.1f%%'
        )
        plt.setp(autotexts, size=10, weight="bold", color='white')
        centre_circle = plt.Circle((0, 0), 0.28, color='white', fc='white', linewidth=1.25)
        fig = plt.gcf()
        fig.gca().add_artist(centre_circle)
        plt.axis('equal')
        plt.title(title)
        plt.legend(
            labels=[
                f"Верные предсказания ({score.get('right')} из {score.get('total')})",
                f"Неверные предсказания ({score.get('missed')} из {score.get('total')})"],
            loc="lower left")
        plt.savefig(CHARTS_DIR + f'{title}.png')
        plt.close()

    def neural_prediction_errors(self):
        df = pd.read_csv(CSV_PATH, sep=',')
        x, y = [df.drop('HeartDisease', axis=1).values, df['HeartDisease'].values]
        x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.003, random_state=42)
        y_result = []
        for it_x in x_test:
            y_result.append(Predictor()._Predictor__neural_prediction(it_x))
        self._make_plot(self._accuracy_score(y_test, y_result), "Точность результата")
        self._make_plot(self._trend_score(y_test, y_result), "Предсказание тренда")
        return self._accuracy_score(y_test, y_result)

    def test_survey_accuracy(self):
        for key, value in VERIFIED_RISK_RESPONDENTS.items():
            risk = Predictor().perform_prediction(value)[1]
            self.assertTrue(GROUPS_RISK_RANGE.get(key).get('min') < risk <= GROUPS_RISK_RANGE.get(key).get('max'))

