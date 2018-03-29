exports.contract_address = "0x6D39a08A5E4120448c2eFd14E936AC6247916189";

exports.abi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "slot",
				"type": "bytes32"
			},
			{
				"name": "room",
				"type": "bytes32"
			}
		],
		"name": "cancelReservation",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getUserCompany",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "newUser",
				"type": "address"
			},
			{
				"name": "company",
				"type": "string"
			}
		],
		"name": "authorizeNewUser",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "isAuthorized",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "slot",
				"type": "bytes32"
			},
			{
				"name": "rooms",
				"type": "bytes32[]"
			}
		],
		"name": "resetReservationsForSlot",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "slot",
				"type": "bytes32"
			},
			{
				"name": "room",
				"type": "bytes32"
			}
		],
		"name": "makeReservation",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "slot",
				"type": "bytes32"
			},
			{
				"name": "room",
				"type": "bytes32"
			}
		],
		"name": "getReservationStatus",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			},
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "timeslot",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"name": "room",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"name": "reservationOwner",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "modificationType",
				"type": "string"
			}
		],
		"name": "agendaModification",
		"type": "event"
	}
]
