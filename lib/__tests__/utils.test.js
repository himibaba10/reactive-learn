import { getEmbedUrl, slugify } from '../utils';

describe('utils suite', () => {
  describe('slugify suite', () => {
    it('should return empty string if text is empty', () => {
      const text = '';
      const slug = slugify(text);
      expect(slug).toBe('');
    });
    it('should slugify the text correctly', () => {
      const text = 'Hello World';
      const slug = slugify(text);
      expect(slug).toBe('hello-world');
    });
    it('should throw error if input is not a string', () => {
      const text = 123;
      expect(() => slugify(text)).toThrow('Invalid input: expected string');
    });
  });

  describe('getEmbedUrl suite', () => {
    it('should throw error if input is not a string', () => {
      const url = 123;
      expect(() => getEmbedUrl(url)).toThrow('Invalid input: expected string');
    });
    it('should throw error if input is not a youtube url', () => {
      const url = 'https://www.google.com';
      expect(() => getEmbedUrl(url)).toThrow('Invalid input: expected youtube url');
    });
    it('should return empty string if url is empty', () => {
      const url = '';
      const embedUrl = getEmbedUrl(url);
      expect(embedUrl).toBe('');
    });
    it('should return the same url if it is already an embed url', () => {
      const url = 'https://www.youtube.com/embed/hello-world';
      const embedUrl = getEmbedUrl(url);
      expect(embedUrl).toBe('https://www.youtube.com/embed/hello-world');
    });
    it('should get the embed url correctly', () => {
      const url = 'https://www.youtube.com/watch?v=hello-world';
      const embedUrl = getEmbedUrl(url);
      expect(embedUrl).toBe('https://www.youtube.com/embed/hello-world');
    });
  });
});
