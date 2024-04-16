import React, { useContext, useReducer, useState } from 'react';


interface BookProviderProps {
  children: React.ReactNode;
}

// Define types
interface Book {
  title: string;
  author: string;
  genre: string;
}

interface State {
  books: Book[];
  language: string;
}

type Action =
  | { type: 'ADD_BOOK'; payload: Book }
  | { type: 'DELETE_BOOK'; payload: Book }
  | { type: 'SET_LANGUAGE'; payload: string };

// Define initial state
const initialState = {
  books: [],
  language: 'en',
};

// Translations
const translations = {
  en: {
    bookCatalog: 'Book Catalog',
    addBook: 'Add Book',
    delete: 'Delete',
    title: 'Title',
    author: 'Author',
    genre: 'Genre',
  },
  ja: {
    bookCatalog: '書籍カタログ',
    addBook: '本を追加する',
    delete: '削除する',
    title: '題名',
    author: '著者',
    genre: 'ジャンル',
  },
  es: {
    bookCatalog: 'Catálogo de Libros',
    addBook: 'Añadir Libro',
    delete: 'Eliminar',
    title: 'Título',
    author: 'Autor',
    genre: 'Género',
  },
};

// Define reducer
const reducer = (state: State, action: Action): State  => {
  switch (action.type) {
    case 'ADD_BOOK':
      return {
        ...state,
        books: [...state.books, action.payload],
      };
    case 'DELETE_BOOK':
      return {
        ...state,
        books: state.books.filter(book => book !== action.payload),
      };
    case 'SET_LANGUAGE':
      return {
        ...state,
        language: action.payload,
      };
    default:
      return state;
  }
};

const BookContext = React.createContext<State | undefined>(undefined);

// BookProvider component
const BookProvider: React.FC<BookProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <BookContext.Provider value={{ state, dispatch }}>
      {children}
    </BookContext.Provider>
  );
};

// useBookContext hook
const useBookContext = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBookContext must be used within a BookProvider');
  }
  return context;
};

// BookCatalog component
const BookCatalog = () => {
  const { state, dispatch } = useBookContext();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');

  const handleAddBook = () => {
    dispatch({ type: 'ADD_BOOK', payload: { title, author, genre } });
    setTitle('');
    setAuthor('');
    setGenre('');
  };

  const handleDeleteBook = (book : Book) => {
    dispatch({ type: 'DELETE_BOOK', payload: book });
  };

  return (
    <div>
      <h1>{translations[state.language].bookCatalog}</h1>
    <div>
    <label>{translations[state.language].title}</label>
      <input value={title} onChange={e => setTitle(e.target.value)} />
    </div>
    <div>
    <label>{translations[state.language].author}</label>
      <input value={author} onChange={e => setAuthor(e.target.value)} />
    </div>
     <div>
     <label>{translations[state.language].genre}</label>
      <input value={genre} onChange={e => setGenre(e.target.value)} />
     </div>
      <button onClick={handleAddBook}>{translations[state.language].addBook}</button>
      <ul>
        {state.books.map((book, index) => (
         <div>
          <h3>{book.title}  <button onClick={() => handleDeleteBook(book)}>{translations[state.language].delete}</button></h3>
          <p>{translations[state.language].author} : {book.author}</p>
          <p>{translations[state.language].genre} : {book.genre}</p>
         </div>
        ))}
      </ul>
    </div>
  );
};

// LanguageSelector component
const LanguageSelector = () => {
  const { state, dispatch } = useBookContext();

  const handleLanguageChange = (e) => {
    dispatch({ type: 'SET_LANGUAGE', payload: e.target.value });
  };

  return (
    <select onChange={handleLanguageChange} value={state.language}>
      <option value="en">English</option>
      <option value="ja">日本語</option>
      <option value="es">Español</option>
    </select>
  );
};

export default function Home() {
  return (
    <BookProvider> 
      <div>
        <LanguageSelector />
        <BookCatalog />
      </div>
    </BookProvider>
  );
}
