import React, { Component } from 'react';
import * as BooksAPI from './BooksAPI'
import {Link} from 'react-router-dom'


class BooksSearch extends Component {
    state = {
        /**
         * TODO: Instead of using this state variable to keep track of which page
         * we're on, use the URL in the browser's address bar. This will ensure that
         * users can use the browser's back and forward buttons to navigate between
         * pages, as well as provide a good URL they can bookmark and share.
         */
        searchResult: [],
        searchQuery: '',
        j: 1
      }
      
      clearsearching = () => {
        this.setState({searchQuery: ''})
        this.setState({searchResult: []})
      }
      searchQueryUpdate = (sQuery) => {
        this.setState({searchQuery: sQuery})
      }
      
      componentDidUpdate() {
        if(this.state.searchQuery.length>0) { 
            BooksAPI.search(this.state.searchQuery).then((allBooks) => {
              //check if no errors
              if(Array.isArray(allBooks) && allBooks.length > 0) {
                //add imageLinks.thumbnail to image that not has thumbnail
                allBooks.forEach(book => {
                    if(!('imageLinks' in book)) {
                        book['imageLinks'] = {};
                        book.imageLinks.thumbnail = '';
                    }
                    let a = this.props.currentlyReading.filter((currentlyReadingBook) => 
                                currentlyReadingBook.id === book.id);
                    let b = this.props.wanttoRead.filter((wanttoReadBook) =>  
                                wanttoReadBook.id === book.id);
                    let c = this.props.read.filter((readBook) => 
                                readBook.id === book.id);
                    if(a.length>0) {
                            book.shelf = 'currentlyReading';

                    }
                    
                    else if(b.length>0) {
                            book.shelf = 'wantToRead'
                    }

                    else if(c.length>0) {
                            book.shelf = 'read';
                    }
                    else {
                        book.shelf = 'none';
                    }
                });
                this.setState({
                    searchResult: allBooks,
                    j: 1
                })
              }
              else {
                //when error show nothing
                this.setState({
                    searchResult: []
                })
              }
            })
          }
          
        if(this.state.j === 1 && this.state.searchQuery.length === 0) {
            this.setState({
                searchResult: [],
                j: 0
            })
        }
      }

      render() {       
        return (
          
            <div className="search-books">
                <div className="search-books-bar">
                    <Link 
                    to='/'
                    className="close-search" 
                    onChange = {this.clearsearching}
                    >Close</Link>
                    <div className="search-books-input-wrapper">
                    {/*
                        NOTES: The search from BooksAPI is limited to a particular set of search terms.
                        You can find these search terms here:
                        https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                        However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                        you don't find a specific author or title. Every search is limited by search terms.
                    */
                        
                    }
                    <input
                        type="text" 
                        placeholder="Search by title or author"
                        value={this.state.query}
                        onChange={(event) => this.searchQueryUpdate(event.target.value)}
                    />

                    </div>
                </div>
                <div className="search-books-results">
                    <ol className="books-grid">
                    {this.state.searchResult.map((book) => 
                        (
                            <li key={book.id}>
                            <div className="book">
                                <div className="book-top">
                                <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: 'url(' + book.imageLinks.thumbnail + ')'}}></div>
                                <div className="book-shelf-changer">
                                    <select defaultValue={book.shelf} onChange={((event) => this.props.OnUpdateBookshelf(event.target.value,book.id))}>
                                    <option value="move" disabled>Move to...</option>
                                    <option value="currentlyReading">Currently Reading</option>
                                    <option value="wantToRead">Want to Read</option>
                                    <option value="read">Read</option>
                                    <option value="none">None</option>
                                    </select>
                                </div>
                                </div>
                                <div className="book-title">{book.title}</div>
                                <div className="book-authors">{book.authors}</div>
                            </div>
                            </li>

                        ))}
                    </ol>
                </div>
            </div>
        )
      }
}


export default BooksSearch