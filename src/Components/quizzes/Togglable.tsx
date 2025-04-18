import { useState, forwardRef, useImperativeHandle } from 'react'

interface props {
    buttonLabel: string
    children: React.ReactNode
}

const Togglable = forwardRef((props: props, refs) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? '' : 'none' }
  const showWhenVisible = { display: visible ? 'none' : '' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility
    }
  })

  Togglable.displayName = 'Togglable'

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>Full Screen</button>
      </div>
    </div>
  )
})

export default Togglable