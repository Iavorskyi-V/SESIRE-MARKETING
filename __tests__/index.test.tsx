import { render, screen, fireEvent } from '@testing-library/react';
import Home from '@/pages/index';

describe('Home', () => {
  test('renders form elements', () => {
    render(<Home />);

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Surname')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('CV')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  test('displays validation errors on form submit with empty fields', async () => {
    render(<Home />);


    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(await screen.findByText('Please enter your name.')).toBeInTheDocument();
    expect(await screen.findByText('Please enter your surname.')).toBeInTheDocument();
    expect(await screen.findByText('Please enter a valid email address.')).toBeInTheDocument();
    expect(await screen.findByText('Please upload a CV.')).toBeInTheDocument();
  });

});
