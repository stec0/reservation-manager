var ReservationManager = artifacts.require("./ReservationManager.sol");

module.exports = function(deployer) {
  deployer.deploy(ReservationManager, {gas: 2000000});
};
