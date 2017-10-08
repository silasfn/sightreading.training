
import * as React from "react"
import {classNames, MersenneTwister} from "lib"

let {PropTypes: types} = React
let {CSSTransitionGroup} = React.addons || {}

import {setTitle} from "st/globals"

import Select from "st/components/select"

import NoteMathExercise from "st/components/flash_cards/note_math_exercise"

class SettingsPanel extends React.PureComponent {
  static propTypes = {
    close: types.func,
    updateSettings: types.func.isRequired,
    exercises: types.array.isRequired,
    currentExercise: types.func.isRequired, // class
    currentExerciseSettings: types.object.isRequired,
  }

  render() {
    let current = this.props.currentExercise

    return <section className="settings_panel">
      <div className="settings_header">
        <button onClick={this.props.close}>Close</button>
        <h3>Settings</h3>
      </div>

      <section className="settings_group">
        <Select
          name="exercise"
          className="exercise_selector"
          value={current ? current.exerciseId : null}
          options={this.props.exercises.map(e => ({
            name: e.exerciseName,
            value: e.exerciseId
          }))}/>
      </section>
      {this.renderExerciseOptions()}
    </section>
  }

  renderExerciseOptions() {
    if (!this.props.currentExercise) {
      return
    }

    let ExerciseOptions = this.props.currentExercise.ExerciseOptions
    return <ExerciseOptions
      updateSettings={this.props.updateSettings}
      currentSettings={this.props.currentExerciseSettings} />
  }
}


export default class FlashCardPage extends React.PureComponent {
  constructor(props) {
    super(props)

    this.exercises = [
      NoteMathExercise
    ]

    this.state = {
      currentExerciseIdx: 0,
      currentExerciseSettings: {},
      settingsPanelOpen: false,
    }

    this.state.currentExerciseSettings = this.exercises[this.state.currentExerciseIdx].defaultSettings()
    this.updateExerciseSettings = this.updateExerciseSettings.bind(this)
    this.closeSettingsPanel = () => this.setState({ settingsPanelOpen: false })
  }

  setExercise(idx) {
    let exercise = this.exercises[idx]
    if (!exercise) {
      throw new Error(`Invalid exercise ${idx}`)
    }

    this.setState({
      currentExerciseIdx: idx,
      currentExerciseSettings: exercise.defaultSettings()
    })
  }

  updateExerciseSettings(settings) {
    this.setState({
      currentExerciseSettings: settings
    })
  }

  componentDidMount() {
    setTitle("Flash Cards")
  }

  render() {
    let Exercise = this.exercises[this.state.currentExerciseIdx]

    return <div className="flash_card_page">
      <div className="flash_card_header">
        <div className="exercise_label">{Exercise ? Exercise.exerciseName : ""}</div>
        <button onClick={e => this.setState({
          settingsPanelOpen: true
        })} type="button">Settings</button>
      </div>

      {this.renderExercise()}

      <CSSTransitionGroup transitionName="slide_right" transitionEnterTimeout={200} transitionLeaveTimeout={100}>
        {this.renderSettings()}
      </CSSTransitionGroup>
    </div>
  }

  renderExercise() {
    let Exercise = this.exercises[this.state.currentExerciseIdx]
    return <Exercise settings={this.state.currentExerciseSettings} />
  }

  renderSettings() {
    if (!this.state.settingsPanelOpen) {
      return
    }

    let Exercise = this.exercises[this.state.currentExerciseIdx]

    return <SettingsPanel
      close={this.closeSettingsPanel}
      exercises={this.exercises}
      currentExercise={Exercise}
      currentExerciseSettings={this.state.currentExerciseSettings}
      updateSettings={this.updateExerciseSettings}
    />
  }
}
