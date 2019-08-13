# Consensys Project Course spring 2019 - uPort extension 

This projects is intended to be an extensiotn of [uPort](https://www.uport.me). Citing their site: uPort returns ownership of identity to the individual. uPort's open identity system allows users to register their own identity on Ethereum, send and request credentials, sign transactions, and securely manage keys & data.

What I'm adding to their open identity system are:

- Delegates managment without using a traditional multi sig smart contract, like uPort does.
- Credentials managment, revoke and check credential status.

## General Concept to know

### Verifiable Credentials

Here when I talk about Credential I'm talking about Verifiable Credential, which is a standard proposed by [W3C](https://www.w3.org/TR/verifiable-claims-data-model/). 

In the physical world, a credential might consist of:

- Information related to the subject of the credential (for example, a photo, name, and identification number)
- Information related to the issuing authority (for example, a city government, national agency, or certification body)
- Information related to the specific attribute(s) or properties being asserted by issuing authority about the subject
- Evidence related to how the credential was derived
- Information related to expiration dates.

A verifiable credential can represent all of the same information that a physical credential represents. The addition of technologies, such as digital signatures, makes verifiable credentials more tamper-evident and more trustworthy than their physical counterparts. 

### DID and DID Document

The key actors in an open identity systems are:

- User: the owner of some Verifiable Credentials, a student.
- Issuer: the entity issuing one or more Verifiable Credentials, a University.
- Verifier: one who only reads a Verifiable Credential and makes sure he trusts the issuer, an employer.

Each one of this actor, in order to access the open identity system needs an identifier, which is always standardised by the W3C, and it is called [DID](https://w3c-ccg.github.io/did-spec/#did-documents) Decentralized Identifier

W3C proposed a new standard for objects addressing which lives under the control of nobody, leveraging distributed ledger technologies. 
Each ledger that is compliant with DID standards has an associated DID "method" - a set of rules that govern how DIDs are anchored onto a ledger. Uport for example supports did:ethr and others. My method is called did:pistis

Every DID points to a DID Document which is the serialization of the data associated with that DID. The main data to be shown in a DID Document are the public keys with certain privileges over that DID they are associated with. These public keys are the delegates who can complete action, based on the priviliges that they have, on behald of the DID to which the DID Document points to. This can happen  when the identity is an institution or a company, or when someone lose his private key and with the help of a delegates can reaquire the control of his identity. 

An identity starts with no delegates, and the only working address is the identity itself, which can act without any control. As soon as the identity add a delegates with a certain permission, then to complete any operation that requires that kind of permission this has to be confirmed by another delegates. This is to avoid that one of the delegates can steal the someone else identity. Confirmation is never required to sign on behalf of the identity. 

TODO explain primary address logic

### Final note

The project which I'm delivering for the Consensys Course is not the complete project but just a part of it. More precisely it is just the two additions on top of the uPort open identity system stated before. It lacks all the other parts like the Verifiable Credential sharing, issuing and verification process. 

## User Stories

An University wants to integrate their systems with this dashboard in order to start realising Diploma Degree as Verifiable Credentials. They want their Verifiable Credentials to be signed by a unique DID, but at the same time they want to track which University employer is delivering each Verifiable Credential. Hence, they need a way to let their authorized employers sign verifiable credential on the behalf of the University.

So an Univerity employer, possibly the University rector create a new Ethereum account which will be the University DID. Then it sets this identity into the dashboard. When he opens the dashboard for the first time it will have a single identity authorized to act on behalf of the univesity which is the DID of the univesity set before. 

Now, in the Delegates Management page he can see the delegates with their permissions and add or revoke new delegates and watch the list of delegates being updated. As soon as he have two delegates, in order to add or revoke any delegate he will need the confirmation of the another delegate, this is to avoid that someone can become the unique owner of the University DID. 

If the employer has the permission for the Credential Status Management, in the Credential Management page can see the list of credentials issued by the University and check or change their status. If there is more than one delegates with the Credential Status Mangement permission, then the minimum quorum to change the status of a credential is 2, hence one og the other delegates need to confirm the operation.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 

### Prerequisites

- Docker, you can install it [here](https://www.docker.com/get-started)
- Metamask extension, you can download it [here](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=it)

### Installing

Start the docker app.

If you don't already have it you need to create a Metamask account with whom you can interact with the dashboard. 
Switch to Ropsten testnet.
Then you need some ether from the Ropsten Faucet. If you don't already have it just claim one [here](https://faucet.ropsten.be/)

In a new terminal window run the following command to start the backend  

```
docker pull andreataglia/ssi-consensys-backend
docker run -it -p 8080:8080 --rm --name dockerized-client andreataglia/ssi-consensys-backend:v0.1 --address <YOUR NEW METAMASK ACCOUNT> --pk <THE PRIVATE KEY OF YOU ADDRESS>
```


In a new terminal window run the following command to start the frontend  

```
docker pull andreataglia/ssi-consensys-frontend
docker run -it -p 8080:8080 --rm --name dockerized-client andreataglia/ssi-consensys-frontend:v0.1
```

Now on the localhost at the port 8080 you should see the home page of the project

At the top you should see the identity with which you have initialized the backend. On the left you should see the menu with the address with whom you are logged in, and the three main page of the appliction:

- Home, just an home page
- Credential Management, where you can set or check the status of a list of Verifiable Credentials
- Delegates Management, where you can add or revoke new delegates

You can access these pages only if you have the right permission. Try add new delegates with different permissions and to revoke Verifiable Credentials. 
Remeber when you have more than one delegates then you need two delegates to confirm an operation. I suggest you to create more than one metamask account and spread your intial test ether with the others.

## Running the tests

If you want to test the smart contracts, you just need to go to ssi-smart-contracts directory and execute the following commands:

```
truffle dev
truffle test
```

## Authors

* **Andrea Taglia** - 

## Acknowledgments

* Consensys Soidity Bootcamp 2019. https://learn.consensys.net/unit/view/id:1971
