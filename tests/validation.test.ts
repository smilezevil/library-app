import { expect } from 'chai';
import { Validation } from '../src/utils/validators';

describe('Validation', () => {
  describe('isRequired', () => {
    it('returns false for an empty string', () => {
      expect(Validation.isRequired('')).to.equal(false);
    });

    it('returns false for a string with only spaces', () => {
      expect(Validation.isRequired('   ')).to.equal(false);
    });

    it('returns true for a non-empty string', () => {
      expect(Validation.isRequired('Clean Code')).to.equal(true);
    });
  });

  describe('isDigitsOnly', () => {
    it('accepts digits', () => {
      expect(Validation.isDigitsOnly('1725533394038')).to.equal(true);
    });

    it('rejects letters, spaces and empty values', () => {
      expect(Validation.isDigitsOnly('12ab')).to.equal(false);
      expect(Validation.isDigitsOnly('1 2')).to.equal(false);
      expect(Validation.isDigitsOnly('')).to.equal(false);
    });
  });

  describe('isValidYear', () => {
    const currentYear = new Date().getFullYear();

    it('accepts a normal four-digit year', () => {
      expect(Validation.isValidYear('1999')).to.equal(true);
      expect(Validation.isValidYear('2004')).to.equal(true);
    });

    it('accepts the current year', () => {
      expect(Validation.isValidYear(String(currentYear))).to.equal(true);
    });

    it('rejects a year from the future', () => {
      expect(Validation.isValidYear(String(currentYear + 1))).to.equal(false);
    });

    it('rejects values that are not a four-digit year', () => {
      expect(Validation.isValidYear('abc')).to.equal(false);
      expect(Validation.isValidYear('99')).to.equal(false);
      expect(Validation.isValidYear('20000')).to.equal(false);
      expect(Validation.isValidYear('19.9')).to.equal(false);
      expect(Validation.isValidYear('')).to.equal(false);
    });
  });

  describe('isValidEmail', () => {
    it('accepts a correct email', () => {
      expect(Validation.isValidEmail('artem@gmail.com')).to.equal(true);
    });

    it('rejects an incorrect email', () => {
      expect(Validation.isValidEmail('artem')).to.equal(false);
      expect(Validation.isValidEmail('artem@')).to.equal(false);
      expect(Validation.isValidEmail('artem@gmail')).to.equal(false);
    });
  });

  describe('validateUserId', () => {
    it('returns the required message for an empty id', () => {
      expect(Validation.validateUserId('')).to.equal(Validation.REQUIRED_MESSAGE);
    });

    it('returns the digits message when the id contains letters', () => {
      expect(Validation.validateUserId('12ab')).to.equal(Validation.ID_MESSAGE);
    });

    it('returns null for a correct id', () => {
      expect(Validation.validateUserId('1725533394038')).to.equal(null);
    });
  });

  describe('validateBook', () => {
    it('reports every empty field as required', () => {
      const errors = Validation.validateBook({ title: '', author: '', year: '' });

      expect(errors).to.deep.equal({
        title: Validation.REQUIRED_MESSAGE,
        author: Validation.REQUIRED_MESSAGE,
        year: Validation.REQUIRED_MESSAGE,
      });
    });

    it('reports an invalid year', () => {
      const errors = Validation.validateBook({ title: 'Book', author: 'Author', year: 'abcd' });

      expect(errors).to.deep.equal({ year: Validation.YEAR_MESSAGE });
    });

    it('returns no errors for correct data', () => {
      const errors = Validation.validateBook({ title: 'Book', author: 'Author', year: '2004' });

      expect(Validation.hasErrors(errors)).to.equal(false);
    });
  });

  describe('validateUser', () => {
    it('reports empty fields as required', () => {
      const errors = Validation.validateUser({ name: '', email: '' });

      expect(errors).to.deep.equal({
        name: Validation.REQUIRED_MESSAGE,
        email: Validation.REQUIRED_MESSAGE,
      });
    });

    it('reports an invalid email', () => {
      const errors = Validation.validateUser({ name: 'Artem', email: 'not-an-email' });

      expect(errors).to.deep.equal({ email: Validation.EMAIL_MESSAGE });
    });

    it('returns no errors for correct data', () => {
      const errors = Validation.validateUser({ name: 'Artem', email: 'artem@gmail.com' });

      expect(Validation.hasErrors(errors)).to.equal(false);
    });
  });
});
