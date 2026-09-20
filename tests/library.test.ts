import { expect } from 'chai';
import { Book } from '../src/models/Book';
import { User } from '../src/models/User';
import { Library } from '../src/services/Library';

describe('Library<T>', () => {
  let library: Library<Book>;
  let cleanCode: Book;
  let codeComplete: Book;

  beforeEach(() => {
    library = new Library<Book>();
    cleanCode = new Book('1', 'Clean Code', 'Robert Martin', 2008);
    codeComplete = new Book('2', 'Code Complete', 'Steve McConnell', 2004);
  });

  describe('add', () => {
    it('adds an item to the collection', () => {
      library.add(cleanCode);

      expect(library.size).to.equal(1);
      expect(library.getAll()).to.deep.equal([cleanCode]);
    });

    it('keeps the order in which items were added', () => {
      library.add(cleanCode);
      library.add(codeComplete);

      expect(library.getAll()).to.deep.equal([cleanCode, codeComplete]);
    });

    it('throws when an item with the same id already exists', () => {
      library.add(cleanCode);

      expect(() => library.add(new Book('1', 'Another', 'Author', 2000))).to.throw(
        'already exists',
      );
      expect(library.size).to.equal(1);
    });
  });

  describe('remove', () => {
    beforeEach(() => {
      library.add(cleanCode);
      library.add(codeComplete);
    });

    it('removes an existing item and returns true', () => {
      const removed = library.remove('1');

      expect(removed).to.equal(true);
      expect(library.size).to.equal(1);
      expect(library.getById('1')).to.equal(undefined);
    });

    it('returns false and changes nothing when the id does not exist', () => {
      const removed = library.remove('999');

      expect(removed).to.equal(false);
      expect(library.size).to.equal(2);
    });
  });

  describe('getById', () => {
    it('returns the item with the given id', () => {
      library.add(cleanCode);

      expect(library.getById('1')).to.equal(cleanCode);
    });

    it('returns undefined when nothing is found', () => {
      expect(library.getById('1')).to.equal(undefined);
    });
  });

  describe('find', () => {
    beforeEach(() => {
      library.add(cleanCode);
      library.add(codeComplete);
    });

    it('returns all items that match the predicate', () => {
      const result = library.find((book) => book.year > 2005);

      expect(result).to.deep.equal([cleanCode]);
    });

    it('returns an empty array when nothing matches', () => {
      const result = library.find((book) => book.author === 'Nobody');

      expect(result).to.deep.equal([]);
    });
  });

  describe('getAll', () => {
    it('returns a copy, so changing the result does not change the library', () => {
      library.add(cleanCode);

      const all = library.getAll();
      all.pop();

      expect(library.size).to.equal(1);
    });
  });

  describe('constructor and clear', () => {
    it('can be created with initial items', () => {
      const filled = new Library<Book>([cleanCode, codeComplete]);

      expect(filled.size).to.equal(2);
    });

    it('clear removes all items', () => {
      library.add(cleanCode);
      library.clear();

      expect(library.size).to.equal(0);
    });
  });

  describe('generic usage', () => {
    it('works with other types that have an id, for example User', () => {
      const users = new Library<User>();
      users.add(new User('10', 'Artem', 'artem@gmail.com'));

      expect(users.getById('10')?.name).to.equal('Artem');
    });
  });
});
