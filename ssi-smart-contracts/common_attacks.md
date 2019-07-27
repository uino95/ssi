# Pistis SSI Consensys - Design Pattern Decisions

This document describes the common attacks to which the contracts could be susceptible and the countermeasueres adopted.

## Common Attacks 

### Re-entrancy Attacks

A Re-entrancy Attack, according to Solidity documentation, could be present anytime there is an interaction from a contract (A) with another contract (B) and any transfer of Ether hands over control to that contract B. This makes it possible for B to call back into A before this interaction is completed. If contract A has not yet modified its internal storage, when contract B calls back A, then B could recursively call A an undefined number of times (until gas limit is not reached) drawning for example the contract A balance.

I do make external calls to other contracts, but no one of those handle Ether transfer. Beside that, any external call which I make is towards a contract which is known at deploying time and can not be changed. Hence no unexpected behaviour could happen. The only call towards an unknown contract happens in the method executeOperation of MultiSigContract. This call doesn't handle any transfer of Ether and it is made at the end of the function, when all the internal storage update have been already made. Indeed an attacker could recursively call back mine contract, but it will not be able to act maliciously. 

### Integer Overflow and Underflow

According to the solidity documentation, an overflow occurs when an operation is performed that requires a fixed size variable to store a number (or piece of data) that is outside the range of the variable’s data type. An underflow is the converse situation. These situations are problematics when an integer variable could be set by user inputs. 

The only function which accepts integer variable as user input is the confirmOperation in MultiSigOperation contract. In this case the function accepts in input an uint256 as an identifier number for an operation to be confirmed, if this variable underflows or overflows there are no problems. This is because if the sender could not confirm an operation already confirmed or executed, and can not confirm an operation which is not already been submitted as in the MultiSig contract seen during the Consensys Course.

### Denial of Service by Block Gas Limit (or startGas)

A Denial of Service by Block Gas Limit could happen when the execution of a function requires more gas than the Block Gas Limit. This could easily happen when contract funtions works with unlimited size array or string. 

In the contracts which I wrote I do make use of unsized array, primarly for future extendability to allow the execution of unknown function in the execute pattern, explained in the design pattern file. The important thing is that I do not loop over them, and I don't need to do that, because an Operation Executor knows always in advance which parameters is receiving and in which position they are. Basically the array is used just as an universal container for unkown parameters, which the executor knows.

## Authors

* **Andrea Taglia**

## Acknowledgments

Consensys Soidity Bootcamp 2019. https://learn.consensys.net/unit/view/id:1971