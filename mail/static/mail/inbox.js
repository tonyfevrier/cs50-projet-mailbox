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
  document.querySelector('#mail-view').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#mail-view').style.display = "none";

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Get current emails and print it
  fetch(`/emails/${mailbox}`)
   .then(response => response.json())
   .then(data => data.forEach(element => { 

      // Create the email button
      const email = document.createElement('button');
      email.className = "email";
      email.innerHTML = `<p>${element.sender}</p><p>${element.subject}</p><p>${element.timestamp}</p>`;
      if (element.read){email.style.background = 'lightgray';} else {email.style.background = 'white';}

      // Print it and allow the user to watch it
      document.querySelector('#emails-view').append(email);
      email.addEventListener('click',() => view_email(element.id));
    }))
    .catch(error => console.log(error))
}
 

function send_email(event) {
  
  // Send a mail and load the sent box
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
 
  // Delete previous printed email contents
  document.querySelector('#mail-view').innerHTML = "";

  // Show the view containing the mail
  document.querySelector('#mail-view').style.display = "block";
  document.querySelector('#emails-view').style.display = "none";
  document.querySelector('#compose-view').style.display = "none";

  // Get and print the corresponding mail content
  fetch(`/emails/${id}`, {
    method: 'GET',
  })
  .then(response => response.json())
  .then(data => { 

    // Create the email element and add it to the view
    const email_content = document.createElement('div');
    email_content.innerHTML = `<p>${data.subject}</p>
      <div><p>${data.sender}</p><p>${data.timestamp}</p></div>
      <p>${data.recipients}</p>
      <p>${data.body}</p>`
    document.querySelector('#mail-view').append(email_content);

    if (!(data.sender === data.user)){

      // Create a button to archive or unarchive the mail 
      const archive = document.createElement('button');
      if (!data.archived) archive.innerHTML = "Archive this mail";
      else archive.innerHTML = "Unarchive this mail";
      document.querySelector('#mail-view').append(archive);

      // Allow the user to archive the mail
      archive.addEventListener('click', () => toggle_archive_mail(data));
    }

    // Create a button to reply to the email
    const reply = document.createElement('button');
    reply.innerHTML = "Reply to this mail";
    document.querySelector('#mail-view').append(reply);
    reply.addEventListener('click', () => reply_mail(data));
  })
  .catch(error => console.log(error));

  // Put the email as a read one
  fetch(`/emails/${id}`,{
    method: 'PUT',
    body: JSON.stringify({
      read: true,
    })
  }).catch(error => console.log(error));;
}


function toggle_archive_mail(email){
  
  // Archive the mail and redirect to inbox
  fetch(`/emails/${email.id}`,{
    method: 'PUT',
    body: JSON.stringify({
      archived: !email.archived,
    })
  })
  .then(response => load_mailbox('inbox'))
  .catch(error => console.log(error));
}


function reply_mail(email){
  compose_email();
  document.querySelector('#compose-recipients').value = `${email.sender}`;

  // ajouter conditions si commence par Re
  const subject = `${email.subject}`;
  if (subject.startsWith('Re:')){
    document.querySelector('#compose-subject').value = `${email.subject}`;
  } else {
    document.querySelector('#compose-subject').value = `Re: ${email.subject}`;
  }
  document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote:\n\n${email.body}`;
}