# Consensys Project Course spring 2019 - Pistis 

This projects is intended to be an extension of [uPort](https://www.uport.me). Citing their site: uPort returns ownership of identity to the individual. uPort's open identity system allows users to register their own identity on Ethereum, send and request credentials, sign transactions, and securely manage keys & data.

What I'm adding to their open identity system are:

- Delegates Management without using a traditional multi sig smart contract. This is a more generic way of using multi signature operations in a DID based system. It is also about one order of magnitude cheaper adding delegates this way rather than having a factory deploying a brand new multi sig contract for each user.
- Credentials Management, revoke and check credential status.

Please notice that the original project is way larger and aims to be a fully usable digital identity system. It has ben cut down to focus on the smart contracts as intended for this bootcamp.

The project includes:

- 5 Smart Contracts
- A Web UI
- A Web Server (including DID Resolver implementation)

## Few preliminary concepts

### Verifiable Credentials

Here when I talk about Credentials I'm talking about Verifiable Credentials, that is a standard proposed by [W3C](https://www.w3.org/TR/verifiable-claims-data-model/). 

In the physical world, a credential might consist of:

- Information related to the subject of the credential (for example, a photo, name, and identification number)
- Information related to the issuing authority (for example, a city government, national agency, or certification body)
- Information related to the specific attribute(s) or properties being asserted by issuing authority about the subject
- Evidence related to how the credential was derived
- Information related to expiration dates.

A verifiable credential can represent all of the same information that a physical credential represents. The addition of technologies, such as digital signatures, makes verifiable credentials more tamper-evident and more trustworthy than their physical counterparts. 

You'll find 3 verifiable credentials displayed in a user friendly manner in the Credential Management page (see below).

### DID and DID Document

The key actors in an open identity systems are:

- User: the owner of some Verifiable Credentials, a student.
- Issuer: the entity issuing one or more Verifiable Credentials, a University.
- Verifier: one who only reads a Verifiable Credential and makes sure he trusts the issuer, an employer.

Each one of this actor, in order to access the open identity system needs an identifier, which is again standardized by the W3C, and it is called [DID](https://w3c-ccg.github.io/did-spec/#did-documents) Decentralized Identifier.

W3C proposed a new standard for objects addressing which lives under the control of nobody, leveraging distributed ledger technologies. 
Each ledger that is compliant with DID standards has an associated DID "method" - a set of rules that govern how DIDs are anchored onto a ledger. Uport for example supports did:ethr and others. My method is called did:pistis

Every DID points to a DID Document which is the serialization of the data associated with that DID. The main data to be shown in a DID Document are the public keys with certain privileges over that DID they are associated with. These public keys are the delegates who can complete action, based on the privileges that they have, on behalf of the DID to which the DID Document points to. This can happen  when the identity is an institution or a company, or when someone loses his private key and with the help of a delegate can get back control of his identity. I implemented a DID Resolver as proposed by the W3C standard in order to wrap a DID Document for a certain DID.

An identity starts with no delegates, and the only working address is the one who matches the identity itself, which has full permissions over that identity. That is indeed a sort of super user for that identity and, once revoked from anywhere it is completely removed from that identity and can never get back control over it. 
As soon as the identity adds a delegate with a certain permission, the quorum for that kind of operation goes to 2 and from that point onwards 2 confirmations are needed before actual execution.

## User Stories

An University wants to integrate their systems with this dashboard in order to start releasing Diploma Degree as Verifiable Credentials. They want their Verifiable Credentials to be signed by a unique DID, but at the same time they want to track which University employer is delivering each Verifiable Credential. Hence, they need a way to let their authorized employers sign verifiable credential on the behalf of the University.
Let's say the University President creates a new Ethereum account which will be the University DID. Then it sets this identity into the dashboard. When he opens the dashboard for the first time it will have a single identity authorized to act on behalf of the university which is the DID of the university set before. 
Now, in the Delegates Management page he can see the delegates with their permissions and add or revoke new delegates and watch the list of delegates being updated. As soon as he have two delegates, in order to add or revoke any delegate he will need the confirmation of the another delegate, this is to avoid that someone can become the unique owner of the University DID. It is also a way to handle key recovery for a specific DID.

If the employer has the permission for the Credential Status Management, in the Credential Management page he can see the list of credentials issued by the University and check or change their statuses. If there is more than one delegate with the Credential Status Management permission, then the minimum quorum to change the status of a credential is 2, hence one of the other delegates need to confirm the operation.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine so you can test the contracts and run the project. 
I dockerized the client and the server as encouraged by the project instructions so it should be straightforward for you guys to have it running.

### Prerequisites

- Docker, you can install it from [here](https://www.docker.com/get-started)
- Metamask extension, you can download it from [here](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=it)

### Installing

If you don't already have it you need to create a Metamask account with whom you can interact with the dashboard. 
Switch to Ropsten testnet. You will need some ether to interact with the contract. Also you should need at least two addresses with some Ether. You can get some from the Ropsten Faucet [here](https://faucet.ropsten.be/).


Docker images should be automatically downloaded from Docker Hub when you run the commands below. Run the containers for the the server and the client (you may want to add -d flag to hide the logs if you don't want to be bothered):
```
docker run -p 3000:3000 -e ADDRESS="<YOUR ADDRESS>" -e PRIVATEKEY="<THE PRIVATE KEY OF YOUR ADDRESS>" --rm --name backend andreataglia/ssi-consensys-backend:latest

docker run -p 8080:8080 --rm --name frontend andreataglia/ssi-consensys-frontend:latest
```

Now navigate http://localhost:8080 where you should see the home page of the project.

You should now be asked to give the page permission to interact with metamask.
If everything is fine and your logged-in with the same account you gave to docker as params you should see the two tabs on the left side menu as green.

#### Without docker
If you prefer running stuff from sketch the source code for both the client and the server is in the dashboard folder. 

The server is a node app. Run it with:

```
cd dashboard/server
npm i
cd pistis 
npm i 
cd ..
ADDRESS="<YOUR ADDRESS>" PRIVATEKEY="<THE PRIVATE KEY OF YOUR ADDRESS>" node start.js
```

Client is a VueJS app, run it with:

```
cd dashboard/client
npm i
npm run serve
```

### Getting around in the demo project

At the top you see the DID, that is the identity you used to initialize the backend. On the left you should see the menu with the address with whom you are logged in, and the 3 pages of the application:

- Home, just an home page
- Credential Management, where you can set or check the status of a list of Verifiable Credentials
- Delegates Management, where you can add or revoke new delegates and check which delegate has what permissions

You can access these pages only if you have the right permission, the color of the links will change accordingly. 
Once you are logged in with the primary address, the one which is the same as the identity, you have full permission, it is like a super user for that identity.

I suggest you try the following, as shown in the video:
1. Add a new delegate with Delegate Mgmt permission. The operation will be executed straight away as there is no quorum enabled yet. 
2. Now the quorum is set to 2, so an operation needs to confirmation before being executed. Let's try this out by adding a new delegate with CredentialStatus Mgmt permission. 
3. Switch to the other address and confirm the operation. Beware, Ropsten is slow, like really slow sometime... wait for the spinner to stop. Sorry about that.
4. Then go the Credential Management and try changing the status of a credential.
5. Switch to another address with permission for CredentialStatus Mgmt and confirm the operation.
6. Press check status. It will contact the smart contract and fetch the status of the credential.

Play around!

Hope you like it :)

## Testing the Smart Contracts

- From truffle console:

```
cd ssi-smart-contracts
truffle dev
```

Within the truffle console
```
test
```
The three main contracts have been tested, each with its own javascript tests.

- If you prefer to use Ganache:

Run ganache on standard port 8485

```
cd ssi-smart-contracts
truffle compile
truffle migrate
truffle test
```

## Few Notes on Grading Requirements

- Circuit Breaker has been implemented in the [MultiSigOperations](./ssi-smart-contracts/contracts/MultiSigOperations.sol) contract
- You can find contracts addresses on Ropsten [here](./ssi-smart-contracts/deployed_addresses.txt)
- Design Pattern decisions is [here](./ssi-smart-contracts/design_patterns_decisions.md)
- Avoiding common attacks is [here](./ssi-smart-contracts/avoiding_common_attacks.md)
- PistisDIDRegistry inherits from PermissionRegistry which in turns inherits from OperationExecutor. Also, CredentialStatusRegistry inherits from OperationExecutor.
- The web UI reflects the state change of MultiSigOperations contract, PistisDIDRegistry and CredentialStatusRegistry contracts depending on the operations performed in the UI. It recognized current account as shown in the menu. You can sign transaction with Metamask.

## Authors

* **Andrea Taglia** - 

## Acknowledgments

* Consensys Solidity Bootcamp 2019
