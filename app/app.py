from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import json
import os
from sqlalchemy import exc

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://{user}:{password}@{host}/{dbname}'.format(
    user=os.environ['DB_USER'],
    password=os.environ['DB_PW'],
    host=os.environ['DB_HOST'],
    dbname=os.environ['DB_NAME']
)
db = SQLAlchemy(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/register', methods=['POST'])
def register():
    data = json.loads(request.data)
    newUser = User(data['address'], data['name'])
    try:
        db.session.add(newUser)
        db.session.commit()
        return 'User {} with name {} has been added'.format(data['address'], data['name']), '200'
    except exc.IntegrityError:
        return 'Address already has a name registered', '400'

@app.route('/erase/<address>', methods=['GET'])
def erase(address):
    user = User.query.filter(User.address == address).first()
    if user:
        db.session.delete(user)
        db.session.commit()
        return 'User {} has erased his name'.format(address), '200'
    else:
        return 'User does not have a name registered', '400'

@app.route('/name/<address>', methods=['GET'])
def getName(address):
    user = User.query.filter(User.address == address).first()
    name = user.name if user else None
    return jsonify({
        "address": address,
        "name": name
    })

class User(db.Model):
    __tablename__ = 'names'
    address = db.Column(db.String(64), primary_key=True, nullable=False)
    name = db.Column(db.String(64), nullable=False)

    def __init__(self, address=None, name=None):
        self.address = address
        self.name = name

    def __repr__(self):
        return '<User {address} {name}>'.format(
            address = self.address,
            name = self.name
        )

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=80)
