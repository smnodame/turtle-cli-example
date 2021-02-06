import React, { Component } from 'react'

class VideoBackground extends Component {
	componentWillReceiveProps = () => {}

	componentWillReceiveProps = (nextProps) => {
		if (nextProps.src !== this.props.src && this.refs.video) {
			this.refs['video'].firstChild.src = nextProps.src
			this.refs['video'].load()
		}
	}

	render() {
		const { src, type } = this.props
		return (
			<video ref='video' autoPlay muted loop style={styles.container}>
				<source src={src} type={type || 'video/mp4'} />
			</video>
		)
	}
}

export default VideoBackground

const styles = {
	container: {
		position: 'fixed',
		right: '0',
		bottom: '0',
		minWidth: '100%',
		minHeight: '100%',
	},
}
