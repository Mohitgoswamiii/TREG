from flask import Flask, request, render_template, redirect, url_for, jsonify,flash
import os
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from model import predict_model  

app = Flask(__name__)


app.secret_key = 'MohitGoswami'  


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


db = SQLAlchemy(app)

# User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)

# Create the database tables
with app.app_context():
    db.create_all()
    
# Folder to store uploaded images temporarily
UPLOAD_FOLDER = 'uploads/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Main page (render HTML)
@app.route('/')
def home():
    return render_template('home.html')

@app.route('/our_team')
def our_team():
    return render_template('our_team.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        user = User.query.filter_by(email=email).first()

        if user and check_password_hash(user.password, password):
            print("Login successful")  # Debug message
            flash('Login successful!', 'success')
            return redirect(url_for('index'))
        else:
            print("Invalid credentials")  # Debug message
            flash('Invalid email or password', 'error')
            return redirect(url_for('login'))

    return render_template('login.html')


@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        # Check if the user already exists
        user = User.query.filter_by(email=email).first()
        if user:
            flash('Email address already exists', 'error')
            return redirect(url_for('signup'))

        # Hash the password using the correct method
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256', salt_length=8)
        new_user = User(email=email, password=hashed_password)

        # Add to the database
        db.session.add(new_user)
        db.session.commit()

        print(f"New user added: {email}, {hashed_password}")

        flash('Account created successfully!', 'success')

        # Redirect to the index page
        return redirect(url_for('index'))

    return render_template('signup.html')

@app.route('/index')
def index():
    return render_template('index.html')  


import time



@app.route('/upload', methods=['POST'])
def upload_image():
    if 'carImage' in request.files:
        file = request.files['carImage']
        if file.filename == '' or not allowed_file(file.filename):
            return jsonify({"error": "Invalid file format. Allowed types are png, jpg, jpeg"}), 400
        
        
        filename = secure_filename(f"{int(time.time())}_{file.filename}")
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        
        print(f"Uploaded file path: {file_path}")

        # Run the model prediction
        result = predict_model(file_path)

        # Check and attempt to remove the file
        try:
            if os.path.exists(file_path):
                print(f"Deleting file: {file_path}")
                os.remove(file_path)
            else:
                print(f"File {file_path} not found.")
        except Exception as e:
            print(f"Error deleting file {file_path}: {e}")
        
        # Handle the prediction result
        if result == "Cybertruck":
            return redirect(url_for('index_ct', model='cybertruck'))
        elif result == "Model S":
            return redirect(url_for('index_ct', model='model-s'))
        elif result == "Model 3":
            return redirect(url_for('index_ct', model='model-3'))
        elif result == "Model X":
            return redirect(url_for('index_ct', model='model-x'))
        elif result == "Model Y":
            return redirect(url_for('index_ct', model='model-y'))
        else:
            return redirect(url_for('result', prediction=result))
    
    return jsonify({"error": "No file or text provided."}), 400

# Result page to display the prediction
@app.route('/result')
def result():
    prediction = request.args.get('prediction')
    return render_template('result.html', prediction=prediction)


@app.route('/indexCT')
def index_ct():
    model = request.args.get('model', 'cybertruck') 
    return render_template('indexCT.html', model=model)

if __name__ == '__main__':
    app.run(debug=True)

@app.after_request
def add_header(response):
    # Disable caching in browsers
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    return response