var log = console.log;

log('Secret santa js');

var idIter = 0;
function Person(name, email, excludedRecipients){
	this.name = name;
	this.email = email;
	this.recipient = {name: null, email: null};
	this.excludedRecipients = excludedRecipients;
}

var brian = new Person('Brian', 'brian@brian.com', ['Monique']);
var monique = new Person('Monique', 'mo@mo.com', ['Brian']);

var kristin = new Person('Kristin', 'kristin@kristin.com', ['John']);
var john = new Person('John', 'john@john.com', ['Kristin']);

var matt = new Person('Matt', 'matt@matt.com', ['Lauren']);
var lauren = new Person('Lauren', 'lareun@lareun.com', ['Matt']);

var people = [brian, monique, kristin, john, matt, lauren];

function assignSecretSantas(people){
	var recipientList = [];

	people.forEach(function(person){
		getRecipient(person, recipientList);
	})
}

function getRecipient(person, recipientList){
	var availableRecipients = people.slice();
	//availableRecipients.splice(availableRecipients.indexOf(person), 1);

	recipientList.forEach(function(recipient){
		availableRecipients.splice(availableRecipients.indexOf(recipient), 1);
	})

	var rand = Math.floor(Math.random() * availableRecipients.length); // get random number

	// try again if the santa got themselves of if the recipient is in the excluded list
	if(typeof availableRecipients[rand] != 'undefined' && (person.excludedRecipients.includes(availableRecipients[rand].name) || availableRecipients[rand].name == person.name)){
		console.log("try again")
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

assignSecretSantas(people);

people.forEach(function(person){
	log(person.name + ' -> ' + person.recipient.name);
});
