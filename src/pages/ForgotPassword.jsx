"use client"

import { ArrowLeft, Mail, KeyRound, Eye, EyeOff, Check } from "lucide-react"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { Button } from "~/components/common/ui/Button"
import { useForgotPasswordMutation, useResetPasswordMutation } from "~/store/apis/authSlice"

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isResetComplete, setIsResetComplete] = useState(false)
  const [error, setError] = useState(null)
  const [cooldown, setCooldown] = useState(0)

  // Use the mutation hooks
  const [forgotPassword, { isLoading: isRequestingCode }] = useForgotPasswordMutation()
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation()

  // Handle cooldown timer for resend button
  useEffect(() => {
    let timer
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [cooldown])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null) // Reset error state

    try {
      // Call the forgot password API with email
      const response = await forgotPassword({ email }).unwrap()

      // Show success message
      toast.success(response.message || "Đã gửi mã xác nhận đến email của bạn!")
      setIsSubmitted(true)
      setCooldown(60) // Start cooldown timer
    } catch (err) {
      // Handle error
      const errorMessage = err?.data?.message || "Không thể gửi email khôi phục. Vui lòng thử lại."
      setError(errorMessage)
      toast.error(errorMessage)
    }
  }

  const handleResendCode = async () => {
    if (cooldown > 0) return

    setError(null)
    try {
      const response = await forgotPassword({ email }).unwrap()
      toast.success(response.message || "Đã gửi lại mã xác nhận!")
      setCooldown(60) // Reset cooldown timer
    } catch (err) {
      const errorMessage = err?.data?.message || "Không thể gửi lại mã xác nhận. Vui lòng thử lại."
      setError(errorMessage)
      toast.error(errorMessage)
    }
  }

  const handleVerifyCode = async (e) => {
    e.preventDefault()
    setError(null)

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp")
      return
    }

    // Validate password strength
    if (newPassword.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự")
      return
    }

    try {
      // Call the reset password API with email, code, and new password
      const response = await resetPassword({
        email,
        code: verificationCode,
        newPassword,
      }).unwrap()

      // Show success message
      toast.success(response.message || "Đặt lại mật khẩu thành công!")
      setIsResetComplete(true)

      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate("/login")
      }, 3000)
    } catch (err) {
      // Handle error
      const errorMessage = err?.data?.message || "Mã xác nhận không hợp lệ hoặc đã hết hạn. Vui lòng thử lại."
      setError(errorMessage)
      toast.error(errorMessage)
    }
  }

  return (
    <div className="flex items-center justify-center sm:px-4 py-12 mt-navbar-mobile sm:mt-navbar">
      <div className="max-w-md w-full animate-fade-up">
        <div className="rounded-lg shadow-lg border border-heritage-light/50 bg-card text-card-foreground">
          <div className="flex flex-col items-center p-6 gap-1">
            <h3 className="text-xl sm:text-2xl text-heritage-dark font-bold tracking-tight">
              {isResetComplete ? "Đặt lại mật khẩu thành công" : isSubmitted ? "Đặt lại mật khẩu" : "Quên mật khẩu"}
            </h3>
            <p className="text-sm text-muted-foreground text-center">
              {isResetComplete
                ? "Mật khẩu của bạn đã được đặt lại thành công"
                : isSubmitted
                  ? "Nhập mã xác nhận và mật khẩu mới của bạn"
                  : "Nhập email của bạn để nhận mã xác nhận"}
            </p>
          </div>
          <div className="pt-0 p-6">
            {isResetComplete ? (
              <div className="space-y-4">
                <div className="bg-green-50 text-green-700 p-4 rounded-md text-sm flex items-start">
                  <Check size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Mật khẩu đã được đặt lại thành công!</p>
                    <p className="mt-1">Bạn sẽ được chuyển hướng đến trang đăng nhập trong vài giây...</p>
                  </div>
                </div>
                <Button type="button" className="w-full" onClick={() => navigate("/login")}>
                  <ArrowLeft size={16} />
                  <span>Đến trang đăng nhập</span>
                </Button>
              </div>
            ) : !isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="Nhập email của bạn..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 rounded-md border px-3 py-2 placeholder:text-muted-foreground focus:ring-heritage focus:border-none focus:ring-2 focus:outline-none text-sm"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isRequestingCode}>
                  {isRequestingCode ? (
                    <div className="flex items-center">
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Đang xử lý...
                    </div>
                  ) : (
                    <>
                      <Mail size={16} />
                      <span>Gửi mã xác nhận</span>
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-50 text-blue-700 p-4 rounded-md text-sm">
                  Chúng tôi đã gửi mã xác nhận đến <strong>{email}</strong>. Vui lòng kiểm tra hộp thư của bạn và nhập
                  mã xác nhận bên dưới.
                </div>

                <form onSubmit={handleVerifyCode} className="space-y-4">
                  {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="verificationCode">
                      Mã xác nhận
                    </label>
                    <input
                      type="text"
                      id="verificationCode"
                      name="verificationCode"
                      required
                      placeholder="Nhập mã xác nhận..."
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="w-full h-10 rounded-md border px-3 py-2 placeholder:text-muted-foreground focus:ring-heritage focus:border-none focus:ring-2 focus:outline-none text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="newPassword">
                      Mật khẩu mới
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="newPassword"
                        name="newPassword"
                        required
                        placeholder="Nhập mật khẩu mới..."
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full h-10 rounded-md border px-3 py-2 placeholder:text-muted-foreground focus:ring-heritage focus:border-none focus:ring-2 focus:outline-none text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 top-0 px-3 py-2 h-10"
                      >
                        {showPassword ? (
                          <EyeOff size={16} className="text-muted-foreground" />
                        ) : (
                          <Eye size={16} className="text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="confirmPassword">
                      Xác nhận mật khẩu
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        required
                        placeholder="Xác nhận mật khẩu mới..."
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full h-10 rounded-md border px-3 py-2 placeholder:text-muted-foreground focus:ring-heritage focus:border-none focus:ring-2 focus:outline-none text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-0 top-0 px-3 py-2 h-10"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={16} className="text-muted-foreground" />
                        ) : (
                          <Eye size={16} className="text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-3">
                    <Button type="submit" className="w-full" disabled={isResetting}>
                      {isResetting ? (
                        <div className="flex items-center">
                          <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                          Đang xử lý...
                        </div>
                      ) : (
                        <>
                          <KeyRound size={16} />
                          <span>Đặt lại mật khẩu</span>
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      className="w-full"
                      variant="outline"
                      disabled={cooldown > 0 || isResetting}
                      onClick={handleResendCode}
                    >
                      <Mail size={16} />
                      <span>{cooldown > 0 ? `Gửi lại mã (${cooldown}s)` : "Gửi lại mã xác nhận"}</span>
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
          <div className="text-center pt-0 p-6 text-sm">
            <Link to="/login" className="text-heritage font-medium hover:underline inline-flex items-center">
              <ArrowLeft size={16} className="mr-1" />
              Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
