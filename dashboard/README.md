# Consensys Project Course spring 2019 - uPort extension 

This projects is intended to be an extensiotn of [uPort](https://www.uport.me). Citing their site: uPort returns ownership of identity to the individual. uPort's open identity system allows users to register their own identity on Ethereum, send and request credentials, sign transactions, and securely manage keys & data.

What I'm adding to their open identity system are:

- Delegates managment without using a traditional multi sig smart contract, like uPort does.
- Credentials managment, revoke and check credential status, and an utility which helps building custom credential.

## General Concept to know

Here when I talk about Credential I'm talking about Verifiable Credential, which is a standard proposed by [W3C](https://www.w3.org/TR/verifiable-claims-data-model/). 

In the physical world, a credential might consist of:
- Information related to the subject of the credential (for example, a photo, name, and identification number)
- Information related to the issuing authority (for example, a city government, national agency, or certification body)
- Information related to the specific attribute(s) or properties being asserted by issuing authority about the subject
- Evidence related to how the credential was derived
- Information related to expiration dates.
A verifiable credential can represent all of the same information that a physical credential represents. The addition of technologies, such as digital signatures, makes verifiable credentials more tamper-evident and more trustworthy than their physical counterparts. 

The key actors in these stories and more in general in the uPort open identity systems are:

- User: the owner of some Verifiable Credentials, a student.
- Issuer: the entity issuing one or more Verifiable Credentials, a university.
- Verifier: one who only reads a Verifiable Credential and makes sure he trusts the issuer, an employer.

Each one of this actor, in order to access the open identity system needs an identifier, which is always standardised by the W3C, and it is called [DID](https://w3c-ccg.github.io/did-spec/#did-documents) Decentralized Identifier

W3C proposed a new standard for objects addressing which lives under the control of nobody, leveraging distributed ledger technologies. 
Each ledger that is compliant with DID standards has an associated DID "method" - a set of rules that govern how DIDs are anchored onto a ledger. Uport for example supports did:ethr and others. My method is called did:pistis

Every DID points to a DID Document which is the serialization of the data associated with that DID. The main data to be shown in a DID Document are the public keys with certain privileges over that DID they are associated with. These public keys are the delegates who can complete action, based on the priviliges that they have, on behald o the DID to which the DID Document points to.

## User Stories

An university wants to integrate their systems with this dashboard in order to start realising Diploma Degree as Verifiable Credentials. Given the fact that they want to keep only one Identifier 


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

```
Give examples
```

### Installing

A step by step series of examples that tell you how to get a development env running

Say what the step will be

```
Give the example
```

And repeat

```
until finished
```

End with an example of getting some data out of the system or using it for a little demo

## Running the tests

Explain how to run the automated tests for this system

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Billie Thompson** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc
