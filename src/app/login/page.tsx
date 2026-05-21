async function handleLogin(e: React.FormEvent) {
  e.preventDefault()

  console.log("Trying login...")

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  console.log("DATA:", data)
  console.log("ERROR:", error)

  if (error) {
    alert(error.message)
    return
  }

  alert("Login successful")
  router.push('/home')
}
