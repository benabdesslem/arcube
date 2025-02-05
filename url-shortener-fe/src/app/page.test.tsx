import {beforeEach, expect, test, vi} from 'vitest';
import {render, screen, fireEvent, waitFor, cleanup} from '@testing-library/react';
import Home from '@/app/page';
import createFetchMock from 'vitest-fetch-mock';

const fetchMocker = createFetchMock(vi);

fetchMocker.enableMocks();

beforeEach(() => {
    cleanup();
    fetchMocker.resetMocks();
});


test('renders the page and heading', () => {
    render(<Home/>);
    expect(screen.getByRole('heading', {level: 1, name: 'Shorten a long URL'})).toBeDefined();
});

test('handles URL shortening correctly', async () => {
    render(<Home/>);
    const shortenButton = screen.getByRole('button', {name: /shorten url/i});
    const inputUrl = screen.getByPlaceholderText('Enter long link here');

    // Mocking successful API response
    const mockResponse = {shortId: 'abcde12345'};
    fetchMocker.mockResponseOnce(JSON.stringify(mockResponse), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
    });

    // Enter a valid URL
    fireEvent.change(inputUrl, {target: {value: 'https://example.com'}});
    fireEvent.click(shortenButton);

    // Simulate loading state
    await waitFor(() => expect(screen.getByRole('button', {name: /shortening.../i})).toBeDefined());

    // Wait for shortened URL to appear
    await waitFor(() => screen.getByDisplayValue('http://localhost:3000/abcde12345'));

    // Check for shortened URL input
    const shortUrlInput = screen.getByDisplayValue('http://localhost:3000/abcde12345');
    expect(shortUrlInput).toBeDefined();
});


test('displays error when URL input is empty', async () => {
    render(<Home/>);
    const shortenButton = screen.getByRole('button', {name: /shorten url/i});
    const inputUrl = screen.getByPlaceholderText('Enter long link here');

    // Leave the URL empty
    fireEvent.change(inputUrl, {target: {value: ''}});
    fireEvent.click(shortenButton);

    await waitFor(() => screen.getByText('Please enter a URL'));
    expect(screen.getByText('Please enter a URL')).toBeDefined();
});

test('handles API error when shortening URL', async () => {
    render(<Home/>);
    const shortenButton = screen.getByRole('button', {name: /shorten url/i});
    const inputUrl = screen.getByPlaceholderText('Enter long link here');

    // Mock failed API response
    fetchMocker.mockResponseOnce(JSON.stringify({error: 'Something went wrong'}), {
        status: 500,
        headers: {'Content-Type': 'application/json'},
    });

    // Enter a valid URL
    fireEvent.change(inputUrl, {target: {value: 'https://example.com'}});
    fireEvent.click(shortenButton);

    await waitFor(() => screen.getByText('An error occurred while shortening the URL'));
    expect(screen.getByText('An error occurred while shortening the URL')).toBeDefined();
});

test('displays QR code when clicked', async () => {
    render(<Home/>);
    const shortenButton = screen.getByRole('button', {name: /shorten url/i});
    const inputUrl = screen.getByPlaceholderText('Enter long link here');

    // Mock successful API response
    const mockResponse = {shortId: 'abcde12345'};
    fetchMocker.mockResponseOnce(JSON.stringify(mockResponse), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
    });

    // Enter a valid URL and shorten it
    fireEvent.change(inputUrl, {target: {value: 'https://example.com'}});
    fireEvent.click(shortenButton);

    // Wait for shortened URL to appear
    await waitFor(() => screen.getByDisplayValue('http://localhost:3000/abcde12345'));

    // Click QR Code button
    const qrCodeButton = screen.getByRole('button', {name: /qr code/i});
    fireEvent.click(qrCodeButton);

    // Wait for QR code to appear
    const qrCode = screen.getByTitle('QR Code');
    expect(qrCode).toBeDefined();
});

test('clears the input and shortened URL', async () => {
    render(<Home/>);
    const shortenButton = screen.getByRole('button', {name: /shorten url/i});
    const inputUrl = screen.getByPlaceholderText('Enter long link here');

    // Mock successful API response
    const mockResponse = {shortId: 'abcde12345'};
    fetchMocker.mockResponseOnce(JSON.stringify(mockResponse), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
    });

    // Enter a valid URL and shorten it
    fireEvent.change(inputUrl, {target: {value: 'https://example.com'}});
    fireEvent.click(shortenButton);

    // Wait for shortened URL to appear
    await waitFor(() => screen.getByDisplayValue('http://localhost:3000/abcde12345'));

    const clearButton = screen.getByRole('button', {name: /clear/i});

    // Click "Clear" button
    fireEvent.click(clearButton);

    // Check that input and short URL are cleared
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    expect(inputUrl.value).toBe('');
    expect(screen.queryByDisplayValue('http://localhost:3000/abcde12345')).toBeNull();
});