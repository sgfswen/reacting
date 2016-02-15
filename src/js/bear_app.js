//bear class
var Bear = React.createClass({
  render: function() {
    return (
      <div className="bear">
        <h2 className="bearName">
          Name: {this.props.name}
        </h2>
        <p>
          Fish Preference: {this.props.fishPreferences}
        </p>
      </div>
    );
  }
});

//bear list
var BearList = React.createClass({

  render: function() {
    var bearNodes = this.props.data.map(function(bear) {
      return (
        <div key={bear._id} >
        <Bear name={bear.name} fishPreferences={bear.fishPreference}></Bear>


          <button onClick={ function() {
            console.log(bear._id);
            $.ajax({
              url: 'http://localhost:3000/api/bears/' + bear._id,
              type: 'DELETE',
              cache: false,
              success: function(data) {
                console.log('gone!');
              }.bind(this),
              error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
              }.bind(this)
            });
          }}>x</button>

          <form onSubmit={function(e){
              e.preventDefault();
              var newName = $('#newName').val().trim();
              var newFishPreference = $('#newFish').val().trim();
              if (!newFishPreference || !newName) {
                return;
              }
              $('#newName').val('');
              $('#newFish').val('');
              var newBear = {
                name: newName,
                fishPreference: newFishPreference,
              }
              $.ajax({
                url: 'http://localhost:3000/api/bears/' + bear._id,
                type: 'PUT',
                data: newBear,
                success: function(data) {
                console.log('changed!');
                }.bind(this),
                error: function(xhr, status, err) {
                  console.error(this.props.url, status, err.toString());
                }.bind(this)
                });
            }
          }>

            <input
              type="text"
              id="newName"
              placeholder="Change Name"
            />
            <input
              type="text"
              placeholder="Change Fish"
              id="newFish"
            />
            <button type="submit">update</button>
          </form>

        </div>
      );
    });
    return (
      <div className="bearList">
        {bearNodes}
      </div>
    );
  }
});

//new bear
var BearForm = React.createClass({
  getInitialState: function() {
    return {name: '', fishPreference: ''};
  },
  handleNameChange: function(e) {
    this.setState({name: e.target.value});
  },
  handleFishPreferenceChange: function(e) {
    this.setState({fishPreference: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var name = this.state.name.trim();
    var fishPreference = this.state.fishPreference.trim();
    if (!fishPreference || !name) {
      return;
    }
    this.props.onBearSubmit({name: name, fishPreference: fishPreference});
    this.setState({name: '', fishPreference: ''});
  },
  render: function() {
    return (
      <form className="bearForm" onSubmit={this.handleSubmit}>
        <h2>New Bear</h2>
        <input
          type="text"
          placeholder="Bear Name"
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <input
          type="text"
          placeholder="fish preference"
          value={this.state.fishPreference}
          onChange={this.handleFishPreferenceChange}
        />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

// get the bears and store them in data
var BearBox = React.createClass({
  loadBearsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleBearSubmit: function(bear) {
    console.log(bear);
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: bear,
      success: function(data) {
        console.log('hooray');
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadBearsFromServer();
    setInterval(this.loadBearsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="bearBox">
        <h1>BEARS</h1>
        <BearList data={this.state.data} />
        <BearForm onBearSubmit={this.handleBearSubmit} />
      </div>
    );
  }
});

ReactDOM.render(
  <BearBox url="http://localhost:3000/api/bears" pollInterval={1000} />,
  document.getElementById('content')
);
