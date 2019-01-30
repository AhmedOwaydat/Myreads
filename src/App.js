import React from 'react'
import * as BooksAPI from './BooksAPI'
import {Link} from 'react-router-dom'
import { Route } from 'react-router-dom'
import './App.css'
import BooksSearch from './BooksSearch'

class BooksApp extends React.Component {
  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    currentlyReading: [],
    wanttoRead: [],
    read: [],
    searchResult: [],
    searchQuery: ''
  }

  componentDidMount() {
    BooksAPI.getAll().then((allBooks) => {
      //add imageLinks.thumbnail to image that not has thumbnail
      if(Array.isArray(allBooks) && allBooks.length > 0) {
        allBooks.forEach(book => {
          if(!('imageLinks' in book)) {
            book['imageLinks'] = {};
            book.imageLinks.thumbnail = '';
          }         
        });
      }
      //get currentlyReading books
      //get wanttoRead books
      //get read books
      this.setState({
        currentlyReading: allBooks.filter((book) => book.shelf === "currentlyReading"),
        wanttoRead: allBooks.filter((book) => book.shelf === "wantToRead"),
        read: allBooks.filter((book) => book.shelf === "read")
      }) 
    })

  }

  updateBookshelf = ((shelf,bookID) => {
    let book = {'id': bookID}
    //update book in server
    BooksAPI.update(book, shelf)

    BooksAPI.getAll().then((allBooks) => {
      //add imageLinks.thumbnail to image that not has thumbnail
      if(Array.isArray(allBooks) && allBooks.length > 0) {
        allBooks.forEach(book => {
          if(!('imageLinks' in book)) {
            book['imageLinks'] = {};
            book.imageLinks.thumbnail = '';
          }         
        })
      }
      //get currentlyReading books
      //get wanttoRead books
      //get read books
      this.setState({
        currentlyReading: allBooks.filter((book) => book.shelf === "currentlyReading"),
        wanttoRead: allBooks.filter((book) => book.shelf === "wantToRead"),
        read: allBooks.filter((book) => book.shelf === "read")
      }) 

    })

  })

  searchQueryUpdate = (sQuery) => {
    this.setState({searchQuery: sQuery})
  }

  render() {
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
          });
          this.setState({searchResult: allBooks})
        }
        else {
          //when error show nothing
          this.setState({searchResult: []})
        }
      })
    }
    return (
      <div className="app">
      
      <Route path='/search' render={({ history }) => (
          <BooksSearch
            OnUpdateBookshelf = {this.updateBookshelf}
            currentlyReading = {this.state.currentlyReading}
            wanttoRead = {this.state.wanttoRead}
            read = {this.state.read}
          />
      )}/>
        
        <Route exact path='/' render={() => (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Currently Reading</h2>
                  <div className="bookshelf-books">
                    <ol className="books-grid">
                    
                    {this.state.currentlyReading.map((book) => (
                      <li key={book.id}>
                        <div className="book">
                          <div className="book-top">
                            <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: 'url(' + book.imageLinks.thumbnail + ')'}}></div>
                            <div className="book-shelf-changer">
                              <select defaultValue="currentlyReading" onChange={((event) => this.updateBookshelf(event.target.value,book.id))}>
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
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Want to Read</h2>
                  <div className="bookshelf-books">
                    <ol className="books-grid">
                      
                    {this.state.wanttoRead.map((book) => (
                      <li key={book.id}>
                        <div className="book">
                          <div className="book-top">
                            <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: 'url(' + book.imageLinks.thumbnail + ')'}}></div>
                            <div className="book-shelf-changer">
                              <select defaultValue="wantToRead" onChange={((event) => this.updateBookshelf(event.target.value,book.id))}>
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
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Read</h2>
                  <div className="bookshelf-books">
                    <ol className="books-grid">

                      {this.state.read.map((book) => (
                        <li key={book.id}>
                          <div className="book">
                            <div className="book-top">
                              <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: 'url(' + book.imageLinks.thumbnail + ')'}}></div>
                              <div className="book-shelf-changer">
                                <select defaultValue="read" onChange={((event) => this.updateBookshelf(event.target.value,book.id))}>
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
              </div>
            </div>
            <div className="open-search">
              <Link
                to='/search' 
              >Add a book </Link>

            </div>
          </div>          
        )}/>
      </div>
    )
  }
}

export default BooksApp
