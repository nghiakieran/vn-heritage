import { apiSlice } from './apiSlice'

export const mailSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendVerificationEmail: builder.mutation({
      query: ({ email }) => ({
        url: '/mail/send-verification-email',
        method: 'POST',
        body: { email },
      }),
    }),
    verifyEmail: builder.mutation({
      query: ({ email, code }) => ({
        url: '/mail/verify-email',
        method: 'POST',
        body: { email, code },
      }),
    }),
  }),
})

export const { useSendVerificationEmailMutation, useVerifyEmailMutation } = mailSlice
