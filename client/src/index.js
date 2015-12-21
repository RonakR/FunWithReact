var React = require('react');

bookmarks = [
  {title: "title 01", link: "http://bookmark.com/"},
  {title: "title 02", link: "http://bookmark2.com/"}
]

var BookmarkList = React.createClass({
	getInitialState: function(){
		return {bookmarks: this.props.bookmarks};
	},
	render: function(){
		var removeLine = this.removeLine;

		var bookmarks = this.state.bookmarks.map( function(bookmark) {
			return (
				<Bookmark title={bookmark.title} link={bookmark.link}></Bookmark>
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
		)
	}
});

var Bookmark = React.createClass({
	render: function(){
		return (
			<div>
				<p class="title">{this.props.title}</p>
				<p class="link">
					<a href={this.props.link} target="_blank">
						{this.props.link}
					</a>
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