import { render, screen } from '@testing-library/react'

import { describe, expect, it, vi } from 'vitest'
import * as authAtom from '../../atoms/auth-atom'
import { LoginForm } from '../login-form'

describe('<LoginForm />', () => {
  describe('when auth.email is null', () => {
    it('renders login form', () => {
      vi.spyOn(authAtom, 'useAuth').mockReturnValueOnce({
        email: null,
        login: async () => {},
        logout: async () => {},
      })
      render(<LoginForm />)

      expect(screen.findByText('Login')).not.toBeNull()
    })
  })

  describe('when auth.email is test@email.com', () => {
    it('renders login form', () => {
      vi.spyOn(authAtom, 'useAuth').mockReturnValueOnce({
        email: 'test@email.com',
        login: async () => {},
        logout: async () => {},
      })
      render(<LoginForm />)

      expect(screen.findByText('Logout user test@email.com')).not.toBeNull()
    })
  })
})
