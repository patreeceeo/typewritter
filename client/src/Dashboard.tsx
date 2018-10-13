import React from 'react'
import Link from './Link'

class Presentation extends React.Component {
  public render()  {
    return (
      <div>
        Last built: [todo]
        <Link type="button" to="/build">build</Link>
      </div>
    )
  }
}

export default Presentation
