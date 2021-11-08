import _ from 'lodash'

export const setVariables = (questionId, variables, answer) => {
    const currentVariables = _.get(variables, questionId, [])
    currentVariables.forEach((v) => {
        const value = _.get(answer, `${questionId}.answer.${v.from}.value`)
        _.set(answer, `${questionId}.answer.${v.variable}.value`, value)
    })
}