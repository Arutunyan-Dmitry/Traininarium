from collections import OrderedDict
from typing import Union, Any, List

import numpy as np
import pandas as pd
import joblib
from django.utils import timezone

from traininarium.settings import BASE_DIR, STATIC_URL

pd.set_option('future.no_silent_downcasting', True)

PREDICTION_ATTRIBUTE_LIST = [
    'date_of_birth', 'height', 'gender', 'race', 'is_heart_diseased', 'is_diabetic',
    'is_diabetic_with_diseases', 'diabetic_period', 'is_physical_activity', 'is_kidney_diseased',
    'is_kidney_disease_chronic', 'is_cholesterol', 'is_smoker', 'is_alcoholic',
    'is_stroked', 'is_asthmatic', 'is_skin_cancer', 'weight', 'physical_health',
    'mental_health', 'is_difficult_to_walk', 'is_blood_pressure', 'general_health',
    'sleep_time'
]


class Predictor:
    __pred_df = pd.DataFrame(columns=[
        'Smoking_No', 'Smoking_Yes', 'AlcoholDrinking_No', 'AlcoholDrinking_Yes',
        'DiffWalking_No', 'DiffWalking_Yes', 'Sex_Female', 'Sex_Male',
        'AgeCategory_18-24', 'AgeCategory_25-29', 'AgeCategory_30-34',
        'AgeCategory_35-39', 'AgeCategory_40-44', 'AgeCategory_45-49',
        'AgeCategory_50-54', 'AgeCategory_55-59', 'AgeCategory_60-64',
        'AgeCategory_65-69', 'AgeCategory_70-74', 'AgeCategory_75-79',
        'AgeCategory_80 or older', 'Race_African', 'Race_American', 'Race_Asian',
        'Race_European', 'Race_Indian', 'Race_Other', 'PhysicalActivity_No',
        'PhysicalActivity_Yes', 'GenHealth_Excellent', 'GenHealth_Fair',
        'GenHealth_Good', 'GenHealth_Poor', 'GenHealth_Very good', 'Asthma_No', 'Asthma_Yes',
        'SkinCancer_No', 'SkinCancer_Yes', 'BMI', 'PhysicalHealth', 'MentalHealth', 'SleepTime'
    ])

    @classmethod
    def __is_valid(cls, data: dict):
        if not all(key in data for key in PREDICTION_ATTRIBUTE_LIST):
            raise ValueError("Required data missed.")

    @classmethod
    def __rule_prediction(cls, data: dict):
        """
        Метод предсказания коэффициента ГОФН для человека
        с помощью правил SCORE
        :param data: Модель данных для предсказания
        :return: коэффициент риска по SCORE
        """
        risk = [0.0 for _ in range(6)]
        if data.get('is_heart_diseased') is not None:                     # расчёт риска для ССЗ
            risk[0] = 0.7 if data.get('is_heart_diseased') else 0.1
        else:
            risk[0] = 0
        if data.get('is_diabetic') is not None:                           # расчёт риска для диабета
            if data.get('is_diabetic'):
                if data.get('is_diabetic_with_diseases'):
                    risk[1] = 0.7
                else:
                    risk[1] = 0.7 if data.get('diabetic_period') > 20 else 0.5 if data.get('diabetic_period') > 10 else 0.3
            else:
                risk[1] = 0.1
        else:
            risk[1] = 0
        if data.get('is_stroked') is not None:                            # расчёт риска для инсульта
            risk[2] = 0.7 if data.get('is_stroked') else 0.1
        else:
            risk[2] = 0
        if data.get('is_kidney_diseased') is not None:                     # расчёт риска для заболевания почек
            if data.get('is_kidney_diseased'):
                risk[3] = 0.7 if data.get('is_kidney_disease_chronic') else 0.5
            else:
                risk[3] = 0.1
        else:
            risk[3] = 0
        if data.get('is_cholesterol') is not None:                         # расчёт риска для уровня холестерина
            risk[4] = 0.5 if data.get('is_cholesterol') else 0.1
        else:
            risk[4] = 0
        if data.get('is_blood_pressure') is not None:                      # расчёт риска для АД
            risk[5] = 0.5 if data.get('is_blood_pressure') else 0.1
        else:
            risk[5] = 0
        if risk.count(0) > 3:   # если больше 3х ответов "не знаю", то данные
            return 0            # считаются недействительными
        else:
            return max(risk)

    @classmethod
    def __neural_prediction(cls, x_df: Union[pd.DataFrame, List[Any]]):
        """
        Метод предсказания коэффициента ГОФН для человека
        моделями машинного обучения
        :param x_df: набор данных для предсказания
        :return: коэффициент риска по версии ММО
        """
        step_arr = [0, 0.2, 0.4, 0.6, 0.8, 1]                                    # шаги для нормализации значений методом "коридор"
        ans = joblib.load(str(BASE_DIR / STATIC_URL / 'models/ans-stack.pkl'))   # ансамбль моделей логистической классификации (стекинг)
        mlp = joblib.load(str(BASE_DIR / STATIC_URL / 'models/mlp-rg.pkl'))      # модель нейронной регрессии
        if isinstance(x_df, pd.DataFrame):
            y_class = ans.predict(x_df.values).astype(int)[0]
            y_reg = mlp.predict(x_df.values)[0]
        else:
            y_class = ans.predict(np.array(x_df).reshape(1, len(x_df))).astype(int)[0]
            y_reg = mlp.predict(np.array(x_df).reshape(1, len(x_df)))[0]
        min_len = 1                                         # использование метода "коридор"
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
        elif y_reg > y_class:
            if y_reg < (step_arr[min_n] + step_arr[min_n + 1]) / 2:
                y_reg = step_arr[min_n]
            else:
                y_reg -= (step_arr[min_n + 1] - step_arr[min_n]) / 2
        return y_reg

    def perform_prediction(self, data: dict):
        """
        Метод предсказания коэффициента ГОФН для человека
        :param data: Модель данных для предсказания
        :return: коэффициент риска
        """
        self.__is_valid(data)
        x_df = pd.DataFrame(columns=self.__pred_df.columns)                         # Получение колонок DF
        x_df.at[0, 'BMI'] = data.get('weight') / ((data.get('height') / 100) ** 2)  # Расчёт ИМТ
        x_df.at[0, 'PhysicalHealth'] = data.get('physical_health')                  # Заполнение численных колонок
        x_df.at[0, 'MentalHealth'] = data.get('mental_health')
        x_df.at[0, 'SleepTime'] = data.get('sleep_time')
        binary_columns_mapping = {                                  # словарь связей бинарных полей и колонок
            'Smoking': 'is_smoker',
            'AlcoholDrinking': 'is_alcoholic',
            'DiffWalking': 'is_difficult_to_walk',
            'PhysicalActivity': 'is_physical_activity',
            'Asthma': 'is_asthmatic',
            'SkinCancer': 'is_skin_cancer'
        }
        for key, value in binary_columns_mapping.items():                   # заполнение бинарных колонок
            x_df.at[0, f'{key}_Yes'] = data.get(value)
            x_df.at[0, f'{key}_No'] = not data.get(value)
        x_df.at[0, 'Sex_Male'] = True if data.get('gender') == 'Male' else False    # заполнение колонки "Гендер"
        x_df.at[0, 'Sex_Female'] = not x_df.at[0, 'Sex_Male']
        race_columns = x_df.filter(like=data.get('race'))                           # заполнение колонок Multiple Choice
        x_df.at[0, race_columns.columns[0]] = True
        gen_h_columns = x_df.filter(like=data.get('general_health'))
        x_df.at[0, gen_h_columns.columns[0]] = True
        age = (timezone.now().date() - data.get('date_of_birth')).days // 365       # расчёт возраста
        if age <= 24:
            x_df.at[0, 'AgeCategory_18-24'] = True                          # минимальный возраст
        else:
            if age >= 80:
                x_df.at[0, 'AgeCategory_80 or older'] = True                # максимальный возраст
            else:
                if age % 10 > 4:                                # заполнение колонок возраста с единицами
                    n_age = int(age / 10) * 10 + 9              # большими 4 ("35", "27", ...)
                    age_columns = x_df.filter(like=str(n_age))
                    x_df.at[0, age_columns.columns[0]] = True
                else:
                    n_age = int(age / 10) * 10                  # заполнение колонок возраста с единицами
                    age_columns = x_df.filter(like=str(n_age))  # меньшими 5 ("31", "40", ...)
                    x_df.at[0, age_columns.columns[0]] = True
        x_df = x_df.fillna(False)

        neural_p = self.__neural_prediction(x_df=x_df)    # нейронный предсказатель риска
        rule_p = self.__rule_prediction(data)             # предсказатель риска по правилам

        if rule_p == 0:                                   # если результат предсказателя по
            result = 0, round(neural_p, 2)                         # правилам недействителен, то вернуть
        else:                                                      # нейронный предсказатель, иначе вернуть
            result = 1, round(rule_p * 0.6 + neural_p * 0.4, 2)    # 40% нейронный предсказатель + 60% предсказатель риска по правилам

        if data.get('is_using_data_agreed') is not None:  # если предоставлено право использовать информацию
            if data.get('is_using_data_agreed'):
                filtered_data = {key: data[key] for key in PREDICTION_ATTRIBUTE_LIST if key in data}
                ordered_data = OrderedDict([
                    ('risk_group_kp', result[1]),
                    ('verified', result[0])
                ])
                ordered_data.update(OrderedDict((key, filtered_data[key]) for key in PREDICTION_ATTRIBUTE_LIST))
                pd.DataFrame(dict(ordered_data), index=[""]).to_csv(
                    BASE_DIR / STATIC_URL / 'csv/user-statistic-info.csv',
                    mode='a',
                    header=False,
                    index=False
                )                                   # сохранение данных в .csv для ведения статистики
        return result
