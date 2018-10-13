import React from 'react'
import Container from './FitzContainer'

interface IProps {
  startBuild: () => {},
  stdout: string,
  autoStart: boolean
}

class Presentation extends React.Component<IProps> {
  constructor(props)  {
    super(props)

    this.handleStartClick = this.handleStartClick.bind(this)
  }

  public componentDidMount()  {
    // if(this.props.autoStart) {
    //   this.props.startBuild()
    // }
  }

  public render() {
    return (
      <div>
        <textarea value={this.props.stdout} readOnly={true} />
        <button onClick={this.handleStartClick}>restart</button>
      </div>
    )
  }

  private handleStartClick() {
    this.props.startBuild()
  }
}

export default function BuildConsole(props) {
  return <Container {...props} >{({stdout, startBuild}) => {
    return (
      <Presentation
        stdout={stdout}
        startBuild={startBuild}
        autoStart={true}
      />
    )
  }}</Container>
}
