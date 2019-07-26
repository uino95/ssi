# Pistis SSI Consensys - Design Pattern Decisions

This document describes the design patterns used and the rationale behind them

## Design Patterns

### Circuit Breaker

Circuit breaker pattern is used when the contract may need to be paused from function, either totally or partially, due to a bug found in the code. 
The implementation in my set of contracts is done on the only one who has a function which can be called by users, that is the [MultiSigOperations](contracts/MultiSigOperations.sol) contract. Especially, the confirmation of any operation is reverted in case the circuit breaker is active. This would impede any operation from being executed, which also means that no OperationExecutor contract can have its state changed has no execution can take place.
A stopped boolean drives the pattern, only modifiable from the contract deployer.

### Access Restriction

Access Restriction pattern is needed when a function should not be called by anyone. That's all the restriction you can give, as there is no way to restrict actual visibility of data or function as everything is clear on the blockchain. This is usually implemented by requiring that a certain pool of addresses are calling the function, reverting otherwise. About contract state the private keyword can be used to avoid other contracts to access it.
In this specific scenario the pattern is widely used. Two main uses are explained below:

1. Some functions can only be executed by those who have certain permissions. This is done by using modifiers such as 'actorHasPermission' and 'quorumSatisfied' in the [MultiSigOperations](contracts/MultiSigOperations.sol) contract. The former involves asking a PermissionRegistry contract to check if a certain address has permission for a certain identity. The logics by which that permission is given or not is decided by the [PermissionRegistry](contracts/PermissionRegistry.sol) contract. In this scenario there is the concept of delegates, i.e. those addresses who have certain permissions for a certain DID (which practically is another ethereum address).

2. [OperationExecutor](contracts/OperationExecutor.sol) contract has only one public function (other than the constructor) which can only be called by the [MultiSigOperations](contracts/MultiSigOperations.sol) contract. This ensures that the execution of operations in that OperationExecutor contract are only made in a multi signature manner. A concrete example is the [CredentialStatusRegistry](contracts/CredentialStatusRegistry.sol) contract which can have credentials' status only changed after enough confirmations by those who have permissions. 

### Executor Pattern

A base contract handles conditions that, once met, allow for calling a certain 'execute' function of another [OperationExecutor](contracts/OperationExecutor.sol) contract. This is useful when we want a generic contract to handle operations which would otherwise be replicated along different other contracts. 
In this specific scenario the common logic is the execution of a certain operation after a pool of delegates endorse it. [MultiSigOperations](contracts/MultiSigOperations.sol) contract implements the common logic, while implementing the base [OperationExecutor](contracts/OperationExecutor.sol) contract would ensure the execute function is called once enough confirmations for a certain operation have been transmitted.
While this can be done using a MultiSig contract, for various reasons it has been chosen to implement it in this way. Also I believe this is much more efficient in terms of cost of operations for the users, as it is just a contract call against a full contract deploy for each identity.

Beware this is not a standard Solidity pattern, or at least it was not mentioned in the Consensys course. This is my own proposal as a generic design pattern which I find useful in different situations.


## Authors

* **Andrea Taglia**


## Acknowledgments

Consensys Soidity Bootcamp 2019. https://learn.consensys.net/unit/view/id:1971