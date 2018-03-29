var ReservationManager = artifacts.require("../contracts/ReservationManager.sol");

contract('ReservationManager', async (accounts) => {

  it("should set the admin as a authorized user", async () => {
    let rm = await ReservationManager.deployed();
    let admin = accounts[0];

    let authorized = await rm.isAuthorized({from: admin});
    assert.equal(authorized, true);
  });

  it("should let the admin reset reservations", async () => {
    let rm = await ReservationManager.deployed();
    let admin = accounts[0];

    try {
      await rm.getReservationStatus(
        web3.fromAscii("9am-10am"),
        web3.fromAscii("C1"),
        {from: admin}
      );
    } catch(error) {
      assert.equal(
        error.message,
        "VM Exception while processing transaction: revert"
      );
    }

    await rm.resetReservationsForSlot(
      web3.fromAscii("9am-10am"),
      [web3.fromAscii("C1")],
      {from: admin}
    );

    let status = await rm.getReservationStatus(
      web3.fromAscii("9am-10am"),
      web3.fromAscii("C1"),
      {from: admin}
    );
    assert((status[0] == true) && (status[1] == '0x0000000000000000000000000000000000000000'));
  });

  it("should let the admin authorize new users", async () => {
    let rm = await ReservationManager.deployed();
    let admin = accounts[0];
    let unauthorized_user = accounts[1];

    let unauthorized = await rm.isAuthorized({from: unauthorized_user});
    assert.equal(unauthorized, false);

    await rm.authorizeNewUser(unauthorized_user, "Coke", {from: admin});

    let authorized = await rm.isAuthorized({from: unauthorized_user});
    assert.equal(authorized, true);
  });

  it("should not let other users authorize new users", async () => {
    let rm = await ReservationManager.deployed();
    let authorized_user = accounts[1];
    let unauthorized_user = accounts[2];
    let other_user = accounts[3];

    try {
      await rm.authorizeNewUser(other_user, "Coke", {from: authorized_user});
    } catch(error) {
      assert.equal(
        error.message,
        "VM Exception while processing transaction: revert"
      );
    }

    try {
      await rm.authorizeNewUser(other_user, "Coke", {from: unauthorized_user});
    } catch(error) {
      assert.equal(
        error.message,
        "VM Exception while processing transaction: revert"
      );
    }
  });

  it("should let users know if they are authorized", async () => {
    let rm = await ReservationManager.deployed();
    let authorized_user = accounts[1];
    let unauthorized_user = accounts[2];

    let authorized = await rm.isAuthorized({from: authorized_user});
    assert.equal(authorized, true);
    let unauthorized = await rm.isAuthorized({from: unauthorized_user});
    assert.equal(unauthorized, false);
  });

  it("should let authorized users get the reservations status", async () => {
    let rm = await ReservationManager.deployed();
    let authorized_user = accounts[1];

    let status = await rm.getReservationStatus(
      web3.fromAscii("9am-10am"),
      web3.fromAscii("C1"),
      {from: authorized_user}
    );
    assert(
      (status[0] == true) && (status[1] == '0x0000000000000000000000000000000000000000')
    );
  });

  it("should not let unauthorized users get the reservations status", async () => {
    let rm = await ReservationManager.deployed();
    let unauthorized_user = accounts[2];

    try {
      await rm.getReservationStatus(
        web3.fromAscii("9am-10am"),
        web3.fromAscii("C1"),
        {from: unauthorized_user}
      );
    } catch(error) {
      assert.equal(
        error.message,
        "VM Exception while processing transaction: revert"
      );
    }
  });

  it("should let authorized users get their own company name", async () => {
    let rm = await ReservationManager.deployed();
    let authorized_user = accounts[1];

    let company = await rm.getUserCompany({from: authorized_user});
    assert.equal(company, "Coke");
  });

  it("should not let unauthorized users get their own company name", async () => {
    let rm = await ReservationManager.deployed();
    let unauthorized_user = accounts[2];

    try {
      await rm.getUserCompany({from: unauthorized_user});
    } catch(error) {
      assert.equal(
        error.message,
        "VM Exception while processing transaction: revert"
      );
    }
  });

  it("shoud let authorized users make reservations for empty rooms and slots", async () => {
    let rm = await ReservationManager.deployed();
    let authorized_user = accounts[1];

    let status = await rm.getReservationStatus(
      web3.fromAscii("9am-10am"),
      web3.fromAscii("C1"),
      {from: authorized_user}
    );
    assert(
      (status[0] == true) && (status[1] == '0x0000000000000000000000000000000000000000')
    );

    await rm.makeReservation(
      web3.fromAscii("9am-10am"),
      web3.fromAscii("C1"),
      {from: authorized_user}
    );

    status = await rm.getReservationStatus(
      web3.fromAscii("9am-10am"),
      web3.fromAscii("C1"),
      {from: authorized_user}
    );
    assert((status[0] == false) && (status[1] == authorized_user));
  });

  it("should let authorized users cancel their reservations", async () => {
    let rm = await ReservationManager.deployed();
    let authorized_user = accounts[1];

    status = await rm.getReservationStatus(
      web3.fromAscii("9am-10am"),
      web3.fromAscii("C1"),
      {from: authorized_user}
    );
    assert((status[0] == false) && (status[1] == authorized_user));

    await rm.cancelReservation(
      web3.fromAscii("9am-10am"),
      web3.fromAscii("C1"),
      {from: authorized_user}
    );

    status = await rm.getReservationStatus(
      web3.fromAscii("9am-10am"),
      web3.fromAscii("C1"),
      {from: authorized_user}
    );
    assert(
      (status[0] == true) && (status[1] == '0x0000000000000000000000000000000000000000')
    );
  });

  it("should not let authorized users make reservations on occupied rooms", async () => {
    let rm = await ReservationManager.deployed();
    let admin = accounts[0];
    let authorized_user = accounts[1];
    let other_authorized_user = accounts[3];

    // preparation for the test
    await rm.authorizeNewUser(other_authorized_user, "Pepsi", {from: admin});
    await rm.makeReservation(
      web3.fromAscii("9am-10am"),
      web3.fromAscii("C1"),
      {from: other_authorized_user}
    );

    try {
      await rm.makeReservation(
        web3.fromAscii("9am-10am"),
        web3.fromAscii("C1"),
        {from: authorized_user});
    } catch(error) {
      assert.equal(
        error.message,
        "VM Exception while processing transaction: revert"
      );
    }
  });

  it("should not let authorized users make cancel other users reservations", async () => {
    let rm = await ReservationManager.deployed();
    let admin = accounts[0];
    let authorized_user = accounts[1];
    let other_authorized_user = accounts[3];

    try {
      await rm.cancelReservation(
        web3.fromAscii("9am-10am"),
        web3.fromAscii("C1"),
        {from: authorized_user});
    } catch(error) {
      assert.equal(
        error.message,
        "VM Exception while processing transaction: revert"
      );
    }
  });

  it("should not let unauthorized users make reservations", async () => {
    let rm = await ReservationManager.deployed();
    let unauthorized_user = accounts[2];

    try {
      await rm.makeReservation(
        web3.fromAscii("9am-10am"),
        web3.fromAscii("C1"),
        {from: unauthorized_user});
    } catch(error) {
      assert.equal(
        error.message,
        "VM Exception while processing transaction: revert"
      );
    }
  });

});
