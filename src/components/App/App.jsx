import { Report } from 'notiflix';
import { useEffect, useState } from 'react';

import ContactForm from 'components/ContactForm';
import ContactList from 'components/ContactList';
import Filter from '../Filter';
import { Container, SubTitle, Title } from './App.styled';

const KEY_CONTACTS = 'name/tell';

const App = () => {
  const [contacts, setContacts] = useState(() =>
    JSON.parse(localStorage.getItem(KEY_CONTACTS) || [])
  );
  const [filter, setFilter] = useState('');

  useEffect(() => {
    localStorage.setItem(KEY_CONTACTS, JSON.stringify(contacts));
  }, [contacts]);

  const onSubmitForm = contact => {
    const isContainName = checkName(contact.name);

    isContainName && setContacts(state => [...state, contact]);
  };

  const handleFilter = e => {
    setFilter(e.currentTarget.value);
  };

  const deleteContact = contactId => {
    setContacts(state => state.filter(({ id }) => id !== contactId));
  };

  const checkName = newName => {
    if (contacts.some(({ name }) => name === newName)) {
      Report.warning(`${newName} is already in contacts`);
      return false;
    }
    return true;
  };

  return (
    <Container>
      <Title>Phonebook</Title>
      <ContactForm onSubmit={onSubmitForm} />
      <SubTitle>Contacts</SubTitle>
      <Filter value={filter} toFilter={handleFilter} />
      <ContactList
        renderItems={ContactsAfterFilter(contacts, filter)}
        deleteContact={deleteContact}
      />
    </Container>
  );
};

const ContactsAfterFilter = (contacts, filter) => {
  const normalizzedFilter = filter.toLowerCase();

  return contacts.filter(
    ({ name, number }) =>
      name.toLowerCase().includes(normalizzedFilter) ||
      number.includes(normalizzedFilter)
  );
};

export default App;
