document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // Send an email 
  document.querySelector('.btn-primary').addEventListener('click',send_email);

  // By default, load the inbox
  load_mailbox('inbox');
});
 

function compose_email() { 

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Get current emails and print it
  fetch(`/emails/${mailbox}`)
   .then(response => response.json())
   .then(data => data.forEach(element => { 
      const email = document.createElement('button');
      email.className = "email";
      email.innerHTML = `<p>${element.sender}</p><p>${element.subject}</p><p>${element.timestamp}</p>`;
      if (element.read){email.style.background = 'lightgray';}
      document.querySelector('#emails-view').append(email);
      email.addEventListener('click',() => view_email(element.id));
    }))
    .catch(error => console.log(error))
}
 

function send_email(event) {
  // send a post request to the API to send an email and show the inbox  sent

  event.preventDefault();   
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients : document.querySelector('#compose-recipients').value,
      subject : document.querySelector('#compose-subject').value,
      body : document.querySelector('#compose-body').value,
    })})
    .then(response => {
      load_mailbox('sent')
    })
    .catch(error => console.log(error));
}


function view_email(id){
  console.log(111111111111111111)
  document.body.querySelector('#mail-view').style.display = "block";
  document.body.querySelector('#emails-view').style.display = "none";
  document.body.querySelector('#compose-view').style.display = "none";

  /*fetch(`/emails/${id}`, {
    method: 'GET',
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.log(error));*/

}