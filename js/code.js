const urlBase = 'http://cop-4331-19.live/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;			
	
	document.getElementById("loginResult").innerHTML = "";
	
	let tmp = {login:login,password:password};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
				
				if( userId < 1 )
				{
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
				
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;
				
				saveCookie();
				
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function doRegister()
{
	let newFirstName = document.getElementById("registerFirst").value;
	let newLastName = document.getElementById("registerLast").value;
	let newLogin = document.getElementById("registerName").value;
	let newPassword = document.getElementById("registerPassword").value;
	document.getElementById("registerResult").innerHTML = "";
	
	let tmp = {FirstName:newFirstName,LastName:newLastName,Login:newLogin,Password:newPassword};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Register.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("registerResult").innerHTML = "Registration successful! Please login.";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("registerResult").innerHTML = err.message;
	}
}

function searchContact()
{
	// let contactList = "<p id=\"contactNameText\">Contact Name</p><p id=\"contactPhoneText\">123-456-7890</p><p id=\"contactEmailText\">contactname@cop-4331-19.live</p><button type=\"button\" id=\"updateButton\" class=\"buttons\" onclick=\"updateContact(\'contactName\',\'contactPhone\',\'contactEmail\');\"> Update Contact </button><button type=\"button\" id=\"deleteButton\" class=\"buttons\" onclick=\"deleteContact(\'contactName\',\'contactPhone\',\'contactEmail\');\"> Delete Contact </button>";
	// document.getElementById("contactListDiv").innerHTML = contactList;

	let srch = document.getElementById("searchBar").value;
	document.getElementById("contactSearchResult").innerHTML = "";
	
	let contactList = "";

	let tmp = {search:srch,UserID:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				if (jsonObject.error == "No Records Found")
				{
					document.getElementById("contactListDiv").innerHTML = "<p id=\"searchPrompt\">No Records Found</p>";
					return;
				}
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					contactList +="<div id=\"" + jsonObject.results[i].Name + "Div\">";
					contactList += "<p id=\"contactNameText\">";
					contactList += jsonObject.results[i].Name;
					contactList += "</p><p id=\"contactPhoneText\">";
					contactList += jsonObject.results[i].Phone;
					contactList += "</p><p id=\"contactEmailText\">";
					contactList += jsonObject.results[i].Email;
					contactList += "</p><button type=\"button\" id=\"updateButton\" class=\"buttons\" onclick=\"updateContactSetup(\'";
					contactList += jsonObject.results[i].Name;
					contactList += "\',\'";
					contactList += jsonObject.results[i].Phone;
					contactList += "\',\'";
					contactList += jsonObject.results[i].Email;
					contactList += "\');\"> Update Contact </button><button type=\"button\" id=\"deleteButton\" class=\"buttons\" onclick=\"deleteContact(\'";
					contactList += jsonObject.results[i].Name;
					contactList += "\',\'";
					contactList += jsonObject.results[i].Phone;
					contactList += "\',\'";
					contactList += jsonObject.results[i].Email;
					contactList += "\');\"> Delete Contact </button>";
					contactList +="</div>";
					if( i < jsonObject.results.length - 1 )
					{
						contactList += "<hr>";
					}
				}
				
				document.getElementById("contactListDiv").innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
}

function addAddContactForm()
{
	let contactFormHTML = "<div id=\"addContactForm\"><button type=\"button\" id=\"closeButton\" class=\"buttons\" onclick=\"closeContactForm();\"> X </button><span id=\"inner-title\">CREATE CONTACT</span><input type=\"text\" id=\"addName\" placeholder=\"Contact Name\" /><br /><input type=\"tel\" id=\"addPhone\" placeholder=\"Contact Phone\" /><br /><input type=\"email\" id=\"addEmail\" placeholder=\"Contact Email\" /><br /><button type=\"button\" id=\"addContactButton\" class=\"buttons\" onclick=\"addContact();\"> Add Contact </button><span id=\"addResult\"></span></div>";
	if (document.getElementById("contactFormPlaceholder").innerHTML != contactFormHTML)
	{
		document.getElementById("contactFormPlaceholder").innerHTML = contactFormHTML;
	}
}

function closeContactForm()
{
	document.getElementById("contactFormPlaceholder").innerHTML = "";
}

function addContact()
{
	let newName = document.getElementById("addName").value;
	let newPhone = document.getElementById("addPhone").value;
	let newEmail = document.getElementById("addEmail").value;
	document.getElementById("addResult").innerHTML = "";
	
	let tmp = {Name:newName,Phone:newPhone,Email:newEmail,UserID:userId};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/AddContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("addResult").innerHTML = "Contact added successfully.";
				document.getElementById("contactListDiv").innerHTML = "<p id=\"searchPrompt\">Search to find your contacts.</p>";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("addResult").innerHTML = err.message;
	}
}

function deleteContact(delName, delPhone, delEmail)
{
	let deleteConfirmPrompt = "Are you sure you want to delete " + delName + " from your contacts?";
	if (confirm(deleteConfirmPrompt))
	{
		let tmp = {Name:delName,UserID:userId};
		let jsonPayload = JSON.stringify( tmp );
	
		let url = urlBase + '/DeleteContact.' + extension;
		
		let xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try
		{
			xhr.onreadystatechange = function() 
			{
				if (this.readyState == 4 && this.status == 200) 
				{
					window.alert("Contact deleted successfully.");
					document.getElementById("contactListDiv").innerHTML = "<p id=\"searchPrompt\">Search to find your contacts.</p>";
				}
			};
			xhr.send(jsonPayload);
		}
		catch(err)
		{
			document.getElementById("contactSearchResult").innerHTML = err.message;
		}
	}
}

function closeUpdateContactForm(upName, upPhone, upEmail)
{
	let elementString = upName + "Div";
	let revertedHTML = "";
	
	revertedHTML += "<p id=\"contactNameText\">";
	revertedHTML += upName;
	revertedHTML += "</p><p id=\"contactPhoneText\">";
	revertedHTML += upPhone;
	revertedHTML += "</p><p id=\"contactEmailText\">";
	revertedHTML += upEmail;
	revertedHTML += "</p><button type=\"button\" id=\"updateButton\" class=\"buttons\" onclick=\"updateContactSetup(\'";
	revertedHTML += upName;
	revertedHTML += "\',\'";
	revertedHTML += upPhone;
	revertedHTML += "\',\'";
	revertedHTML += upEmail;
	revertedHTML += "\');\"> Update Contact </button><button type=\"button\" id=\"deleteButton\" class=\"buttons\" onclick=\"deleteContact(\'";
	revertedHTML += upName;
	revertedHTML += "\',\'";
	revertedHTML += upPhone;
	revertedHTML += "\',\'";
	revertedHTML += upEmail;
	revertedHTML += "\');\"> Delete Contact </button>";
	
	document.getElementById(elementString).innerHTML = revertedHTML;
}

function updateContactSetup(upName, upPhone, upEmail)
{
	let elementString = upName + "Div";
	let updateHTML = "";
	
	updateHTML += "<button type=\"button\" id=\"closeUpdateButton\" class=\"buttons\" onclick=\"closeUpdateContactForm(\'";
	updateHTML += upName;
	updateHTML += "\', \'";
	updateHTML += upPhone;
	updateHTML += "\', \'";
	updateHTML += upEmail;
	updateHTML += "\');\"> X </button><span id=\"inner-title\">UPDATE ";
	updateHTML += upName;
	updateHTML += "</span><input type=\"tel\" id=\"updatePhone";
	updateHTML += upName;
	updateHTML += "\" placeholder=\"Contact Phone\" value=\"";
	updateHTML += upPhone;
	updateHTML += "\" class=\"updatePhone\"/><br /><input type=\"email\" id=\"updateEmail";
	updateHTML += upName;
	updateHTML += "\" placeholder=\"Contact Email\" value=\"";
	updateHTML += upEmail;
	updateHTML += "\" class=\"updateEmail\"/><br /><button type=\"button\" id=\"updateContactButton\" class=\"buttons\" onclick=\"updateContact(\'";
	updateHTML += upName;
	updateHTML += "\', \'";
	updateHTML += upPhone;
	updateHTML += "\', \'";
	updateHTML += upEmail;
	updateHTML += "\');\"> Update Contact </button><span id=\"updateResult";
	updateHTML += upName;
	updateHTML += "\" class=\"updateResult\"></span>";
	
	document.getElementById(elementString).innerHTML = updateHTML;
}

function updateContact(upName, upPhone, upEmail)
{
	let contactUpdateResultString = "updateResult" + upName;
	document.getElementById(contactUpdateResultString).innerHTML = "";
	
	let contactUpdatePhoneString = "updatePhone" + upName;
	
	let contactUpdateEmailString = "updateEmail" + upName;
	
	let newPhone = document.getElementById(contactUpdatePhoneString).value;
	let newEmail = document.getElementById(contactUpdateEmailString).value;
	
	let tmp = {Name:upName,Phone:newPhone,Email:newEmail,UserID:userId};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/UpdateContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactListDiv").innerHTML = "<p id=\"searchPrompt\">Search to find your contacts.</p><span id=\"updateResult\"></span>";
				document.getElementById("updateResult").innerHTML = "Contact updated successfully."
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById(contactUpdateResultString).innerHTML = err.message;
	}
}

function switchToRegister()
{
	window.location.href = "register.html";
}

function switchToLogin()
{
	window.location.href = "index.html";
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("title").innerHTML = "Welcome," + " " + firstName + " " + lastName + "!";
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}
