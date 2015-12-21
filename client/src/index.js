var React = require('react');

bookmarks = [
  {title: "title 01", link: "http://bookmark.com/"},
  {title: "title 02", link: "http://bookmark2.com/"}
]

var BookmarkList = React.createClass({
	getInitialState: function(){
		return {bookmarks: this.props.bookmarks};
	},
	onAddClicked: function(){
		var bookmarks = this.state.bookmarks;
		var title = this.refs.titleInput.getDOMNode().value;
		var link = this.refs.linkInput.getDOMNode().value;

		var bookmark = {title: title, link: link};
		bookmarks.push(bookmark);

		this.setState({bookmarks: bookmarks});
	},
	removeLine: function(line){
		var bookmarks = this.state.bookmarks;
    var index = 0;
    while (index < bookmarks.length && bookmarks[index].link !== line.link) {
      index++;
    }
    if (index < bookmarks.length) {
      var bookmark = bookmarks.splice(index, 1)[0];

      this.setState({bookmarks: bookmarks});
    }
	},
	render: function(){
		var removeLine = this.removeLine;

		var bookmarks = this.state.bookmarks.map( function(bookmark) {
			return (
				<Bookmark title={bookmark.title} link={bookmark.link} removeLine={removeLine}></Bookmark>
			);
		});

		return (
			<div>
				<div>
					<label>Title</label>
					<input ref="titleInput" type="text" ></input>
				</div>
				<div>
					<label>URL</label>
					<input ref="linkInput" type="text" ></input>
				</div>
				<div>
					<button onClick={this.onAddClicked}>+</button>
				</div>
				<div>
					{bookmarks}
				</div>
			</div>
		);
	}
});

var Bookmark = React.createClass({
	onDeleteClicked: function(){
		bookmark = this.props;
		this.props.removeLine(bookmark);

	},
	render: function(){
		return (
			<div>
				<p class="title">{this.props.title}</p>
				<p class="link">
					<a href={this.props.link} target="_blank">
						{this.props.link}
					</a>
				</p>
				<p>
					<button onClick={this.onDeleteClicked}>X</button>
				</p>
			</div>
		);
	}
});

var App = React.createClass({
  render: function() {
  	var bookmark = this.props.bookmarks[0];
    var bookmark2 = this.props.bookmarks[1];
    return (
      <div>
        <h1>My Single Page Application</h1>
				<BookmarkList bookmarks={this.props.bookmarks}></BookmarkList>
      </div>
    )
  }
});


React.render(<App bookmarks={bookmarks} ></App>, document.getElementById('app'));