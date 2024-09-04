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
      const email = document.createElement('div');
      email.innerHTML = `<div><p>${element.sender}</p><p>${element.timestamp}</p>
                         </div><p>${element.subject}</p>`
      document.querySelector('#emails-view').append(email);
    }))
}
 

function send_email(event) {
  // send a post request to the API to send an email and show the inbox 

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
    
    
    //.then(response => response.json())
    //.then(data => console.log(data));

    //.then(() => load_mailbox('inbox')) 
    //.catch(error => console.log(error));

    //load_mailbox('inbox');

}