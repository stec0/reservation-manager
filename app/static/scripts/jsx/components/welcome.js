import Logo from './logo';

export default class Welcome extends React.Component {
  render() {

    // Creating user name input
    var userName;
    switch(this.props.userName) {
        case undefined:
          userName = <div className="main">Hello!</div>
          break;
        case null:
          userName =  <div>
                        <div className="main">Hello!</div>
                        <div className="usernameinput">
                          What is your name?
                          <input id="username" placeholder='enter your name' />
                          <button onClick={ () => this.props.registerUserName(document.getElementById("username").value) }>Confirm</button>
                        </div>
                      </div>
          break;
        default:
          userName = <div className="main">Hello, {this.props.userName}!</div>
    }

    // Generating generic message if user is not authorized
    var userInfo;
    if(this.props.userAuthorized){
      userInfo =  <div>
                    <div className="userinfo">Your address: {this.props.userAddress}</div>
                    <div className="userinfo">Your company: {this.props.userCompany}</div>
                  </div>
    } else {
      userInfo =  <div className="userinfo">You are not authorized to use this app. Contact an administrator to get authorized.</div>
    }

    return (
      <div className="welcome">
        <Logo location={"right"} userCompany={this.props.userCompany}/>
        <div className="greetings">
          { userName }
          { userInfo }
          {([null, undefined].indexOf(this.props.userName) == -1) ? <div className="userinfo"><button onClick={this.props.eraseUserName}>Change your name</button></div> : null }
        </div>
        <Logo location={"left"} userCompany={this.props.userCompany}/>
      </div>
    );
  }
}
