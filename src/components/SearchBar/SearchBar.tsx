import { Formik, Form, Field } from 'formik';
import { toast } from 'react-hot-toast';
import css from './SearchBar.module.css';
import { CiSearch } from 'react-icons/ci';

interface Props {
  onSubmit: (query: string) => void;
}

const SearchBar: React.FC<Props> = ({ onSubmit }) => {
  return (
    <header className={css.header}>
      <Formik
        initialValues={{ query: '' }}
        onSubmit={(values, actions) => {
          const trimmedQuery = values.query.trim();

          if (trimmedQuery === '') {
            toast.error('Please enter a search query!');
            return;
          }

          onSubmit(trimmedQuery);
          actions.resetForm();
        }}
      >
        <Form className={css.form}>
          <Field
            type="text"
            name="query"
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
            className={css.input}
          />
          <button type="submit" className={css.button}>
            <CiSearch />
          </button>
        </Form>
      </Formik>
    </header>
  );
};

export default SearchBar;
