from flask import Flask, render_template, url_for, request, redirect, flash
import logic

app = Flask(__name__)
app.secret_key = 'very_secret_key'


@app.route('/', methods=['POST', 'GET'])
def predict():
    if request.method == "POST":
        heart_disease = request.form.getlist("heart_disease")[0]
        diabetic = request.form.getlist("diabetic")[0]
        diabetic_disease = request.form.getlist("diabetic_disease")[0]
        diabetic_period = int(request.form['diabetic_period'])
        kidney_disease = request.form.getlist("kidney_disease")[0]
        kidney_disease_chronic = request.form.getlist("kidney_disease_chronic")[0]
        cholesterol = request.form.getlist("cholesterol")[0]
        ad = request.form.getlist("ad")[0]

        bmi = request.form['BMI']
        smoking = request.form.get("Smoking")
        pys_h = request.form.get("PhysicalHealth")
        ment_h = request.form.get("MentalHealth")
        sleep = request.form.get("SleepTime")
        stroke = request.form.get("Stroke")
        sex = request.form.get("Sex")
        phys_a = request.form.get("PhysicalActivity")
        alcohol = request.form.get("AlcoholDrinking")
        diff_walk = request.form.get("DiffWalking")
        astma = request.form.get("Astma")
        cancer = request.form.get("SkinCancer")
        race = request.form.getlist("Race")
        gen_health = request.form.getlist("GeneralHealth")
        age = request.form["Age"]

        x = logic.perform_prediction(heart_disease, diabetic, diabetic_disease, diabetic_period,
                                     kidney_disease, kidney_disease_chronic, cholesterol, ad,
                                     bmi, smoking, alcohol, stroke, pys_h, ment_h, diff_walk,
                                     sex, age, race, phys_a, gen_health, sleep, astma, cancer)
        print(x)
        flash('Вероятность возникновения у вас ССЗ: ' + str(round(x * 100, 2)) + '%', 'error')
        return render_template("test.html")
    else:
        return render_template("test.html")


if __name__ == "__main__":
    app.run(debug=True)

