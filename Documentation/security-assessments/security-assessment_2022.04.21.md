# Security Assessment 21.04.2022

Based on the security test concept and the potential threats which we
identified as part of the Threat Model, we performed a brief assessment
of how secure the KubeWatch application is currently.

## Scope

Most of the OWASP top 10 security risks do not apply to the KubeWatch
application since no user login is implemented. However, there are still
a few that remain and should be tested.

The remaining risks to test are: Injection and Server-Side Request
Forgery.

### Injection attack

#### Brief description

Injection attacks can occur on two levels in the KubeWatch application:
on the KubeWatch Backend API and Prometheus. However, the second is not
relevant for this assessment since the only queries are hard-coded and
submitted by the backend only.

The KubeWatch Backend API is connected to a MongoDB database which is
NoSQL-based. NoSQL injection attacks are possible by using the JSON
structure to send queries to the database which are processed as valid
commands.

#### Attack

For our assessment, we tried to query the database so that it would
return the top-level entry. This can be done by sending the following
string via an input field that is supposed to query the database:
`'{$ne: null}'`.

There are currently two fields which take inputs and store them in the
MongoDB database. It is on the */users* page and its current purpose is
to demonstrate that one could create new entries in the database. Later,
this should allow to create new users, but this is not implemented yet
and is out of scope for this assessment.

#### Result

The attack was unsuccessful. This is because of three types of input
validation on two different layers.

Firstly, the input forms in the frontend are of type text and type
email. This achieves that any input to both fields is treated as text,
and additionally, type email requires the specific email format so that
no other sequence of characters is allowed.

Secondly, handlebars are used on the backend which have the benefit when
using two curly brackets to retrieve values from a variable, e.g.
`{{data}}`, any value is interpreted as a string. However, if three
curly brackets were used, the data input is treated as an object, which
would allow execution of e.g. HTML syntax.

Thirdly, since Typescript is used on the backend, the class which is
used to store user inputs contains two variables for each input field.
Both required the input to be of type string.

These three defence mechanisms thwart any type of injection attack.

### Server-Side Request Forgery

#### Brief description

SSRF can currently be attempted on the */notifications* page, which is
temporarily set up to allow the testing of notifications. This page
allows two user inputs: one to trigger a test notification, and the
second provides a reason to silence the notification.

The triggering of notifications will be disabled in the future, however,
the silencing input will remain to allow a user to close any
notifications. Since the silencing reason will be stored in the
database, there may be injection attacks or even SSRF attacks possible.

#### Attack

Similar to the injection attack, we tried to first trigger the pop-up of
an alert using a script: `<script>alert('42')</script>`. Also, we tried
to call a common localhost address, e.g. `http://localhost:8080`.

#### Result

Both attempts were unsuccessful. This is again because of input
validation on the front- and backend as seen previously in the injection
attack.

The frontend input fields allow text only, and the rendering is again
performed by handlebars. Both elements are correctly implemented using
`type=text` and using double curly brackets for the handlebars.

Also, since Typescript is used, the class for handling notifications
requires the notification reason and the silencing text to be stored as
a string.

All three elements do prevent any successful attempt to either perform
an injection or SSRF attack.

### Assessment

As of commit `f144aba6` from 21 April 2022, we did not find any known
vulnerabilities in the KubeWatch application by testing based on the
security test concept.
