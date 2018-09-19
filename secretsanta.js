var nodemailer = require('nodemailer');
var mg = require('nodemailer-mailgun-transport');
const readline = require('readline');
var log = console.log;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}else{

}

var auth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_API_DOMAIN
  }
}

var nodemailerMailgun = nodemailer.createTransport(mg(auth));

function Person(name, email, excludedRecipients){
	this.name = name;
	this.email = email;
	this.recipient = {name: null, email: null};
	this.excludedRecipients = excludedRecipients;
}

var people = [];
var cancelSend = false;

// function promptUser(){
// 	log('--Type "done" to finish entering Santas--')
// 	rl.question('Enter secret santa name: ', (name) => {
// 		if(name != 'done' && name != 'cancel'){
// 			rl.question('Enter secret santa email: ', (email) => {
// 				if(email != 'done' && email != 'cancel'){
// 					rl.question(`Who should be excluded for ${name} (comma delimited): `, (excludedNames) => {
// 						if(email != 'done'){
// 							var excludedNamesString = excludedNames.replace(/\s/g, '');
// 							var excludedNamesArray = excludedNamesString.split(',');
// 							console.log(`Santa added: ${name} : ${email}`);
// 							var newSecretSanta = new Person(name, email, excludedNamesArray);
// 							people.push(newSecretSanta);

// 							promptUser();
// 						}
// 					})
// 				}else if(email == 'cancel'){
// 					cancelSend = true;
// 					rl.close();
// 				}else{
// 					rl.close();
// 				}
// 			});
// 		}else if(name == 'cancel'){
// 			cancelSend = true;
// 			rl.close();
// 		}else{
// 			rl.close();
// 		}
// 	});
// }

// promptUser();

people.push(new Person("Matt", "mattalarie@gmail.com", ["Lauren"]));
people.push(new Person("Lauren", "Lauren@gmail.com", ["Matt"]));
people.push(new Person("Kristin", "Kristin@gmail.com", ["John"]));
people.push(new Person("John", "John@gmail.com", ["Kristin"]));
people.push(new Person("Mo", "Mo@gmail.com", ["Brian"]));
people.push(new Person("Brian", "Brian@gmail.com", ["Mo"]));

processSantas();

function processSantas(){
	assignSecretSantas(people);

	people.forEach(function(person){
		log(person.name + ' -> ' + person.recipient.name);
		sendNotificationEmail(person);
	});
}

function assignSecretSantas(people){
	var recipientList = [];

	people.forEach(function(person){
		getRecipient(person, recipientList);
	})
}

function getRecipient(person, recipientList){
	var availableRecipients = people.slice();

	recipientList.forEach(function(recipient){
		availableRecipients.splice(availableRecipients.indexOf(recipient), 1);
	})

	var rand = Math.floor(Math.random() * availableRecipients.length); // get random number

	// try again if the santa got themselves of if the recipient is in the excluded list
	if(typeof availableRecipients[rand] != 'undefined' && (person.excludedRecipients.includes(availableRecipients[rand].name) || availableRecipients[rand].name == person.name)){
		// todo if person is the only one in recipient list, start over
		getRecipient(person, recipientList);
		return;
	}

	if(typeof availableRecipients[rand] != 'undefined'){
		assignRecipient(person, availableRecipients[rand], recipientList);
	}
}

function assignRecipient(santa, recipient, recipientList){
	if(santa.excludedRecipients.includes(recipient.name)){
		getRecipient(santa, recipientList);
		return;
	}

	santa.recipient.name = recipient.name;
	santa.recipient.email = recipient.email;

	recipientList.push(recipient);
}

function sendNotificationEmail(person){
	var emailText = person.name + ', you will be giving your gift to ' + person.recipient.name + '!';

	nodemailerMailgun.sendMail({
		from: process.env.FROM_EMAIL,
		to: process.env.TEST_TO_EMAIL, // An array if you have multiple recipients.
		subject: person.name + ', your Secret Santa recipient has been chosen!',
		text: emailText,
	}, function (err, info) {
		if (err) {
			console.log('Error: ' + err);
		}
		else {
			console.log('Response: ' + info);
		}
	});
};

// rl.on('close', () => {
// 	if(!cancelSend){
// 		assignSecretSantas(people);

// 		people.forEach(function(person){
// 			log(person.name + ' -> ' + person.recipient.name);
// 			sendNotificationEmail(person);
// 		});
// 	}
// });
