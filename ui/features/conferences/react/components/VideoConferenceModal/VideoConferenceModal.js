/*
 * Copyright (C) 2022 - present Instructure, Inc.
 *
 * This file is part of Canvas.
 *
 * Canvas is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import {useScope as useI18nScope} from '@canvas/i18n'
import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {Modal} from '@instructure/ui-modal'
import {Heading} from '@instructure/ui-heading'
import {Button, CloseButton} from '@instructure/ui-buttons'
import {Checkbox, CheckboxGroup} from '@instructure/ui-checkbox'
import {TextInput} from '@instructure/ui-text-input'
import {NumberInput} from '@instructure/ui-number-input'
import {Flex} from '@instructure/ui-flex'
import {TextArea} from '@instructure/ui-text-area'
import {Tabs} from '@instructure/ui-tabs'

const I18n = useI18nScope('video_conference')

export const VideoConferenceModal = ({open, onDismiss, onSubmit, isEditing, ...props}) => {
  const SETTINGS_TAB = 'settings'
  const ATTENDEES_TAB = 'attendees'

  const OPTIONS_DEFAULT = ['recording_enabled', 'no_time_limit', 'enable_waiting_room']
  const INVITATION_OPTIONS_DEFAULT = ['invite_all']
  const ATTENDEES_OPTIONS_DEFAULT = [
    'share_webcam',
    'share_other_webcams',
    'share_microphone',
    'send_public_chat',
    'send_private_chat'
  ]

  const [tab, setTab] = useState(SETTINGS_TAB)
  const [name, setName] = useState(isEditing ? props.name : '')
  const [duration, setDuration] = useState(isEditing ? props.duration : 60)
  const [options, setOptions] = useState(isEditing ? props.options : OPTIONS_DEFAULT)
  const [description, setDescription] = useState(isEditing ? props.description : '')
  const [invitationOptions, setInvitationOptions] = useState(
    isEditing ? props.invitationOptions : INVITATION_OPTIONS_DEFAULT
  )
  const [attendeesOptions, setAttendeesOptions] = useState(
    isEditing ? props.attendeesOptions : ATTENDEES_OPTIONS_DEFAULT
  )

  const renderCloseButton = () => {
    return (
      <CloseButton
        placement="end"
        offset="medium"
        onClick={props.onDismiss}
        screenReaderLabel={I18n.t('Close')}
      />
    )
  }

  const header = isEditing ? I18n.t('Edit Video Conference') : I18n.t('New Video Conference')

  return (
    <Modal
      as="form"
      open={open}
      onDismiss={onDismiss}
      onSubmit={e => {
        e.preventDefault()
        onSubmit(e, {
          name,
          duration,
          options,
          description,
          invitationOptions,
          attendeesOptions
        })
      }}
      size="auto"
      label={header}
      shouldCloseOnDocumentClick
    >
      <Modal.Header>
        {renderCloseButton()}
        <Heading>{header}</Heading>
      </Modal.Header>
      <Modal.Body padding="none" overflow="fit">
        <Tabs
          onRequestTabChange={(e, {id}) => {
            setTab(id)
          }}
        >
          <Tabs.Panel
            id={SETTINGS_TAB}
            renderTitle={I18n.t('Settings')}
            selected={tab === SETTINGS_TAB}
          >
            <Flex margin="none none large" direction="column">
              <Flex.Item padding="small">
                <TextInput
                  renderLabel={I18n.t('Name')}
                  placeholder={I18n.t('Conference Name')}
                  value={name}
                  onChange={(e, value) => {
                    setName(value)
                  }}
                  isRequired
                />
              </Flex.Item>
              <Flex.Item padding="small">
                <span data-testid="duration-input">
                  <NumberInput
                    renderLabel={I18n.t('Duration in Minutes')}
                    display="inline-block"
                    value={duration}
                    onChange={(e, value) => {
                      if (!Number.isInteger(Number(value))) return

                      setDuration(Number(value))
                    }}
                    onIncrement={() => {
                      if (!Number.isInteger(duration)) return

                      setDuration(duration + 1)
                    }}
                    onDecrement={() => {
                      if (!Number.isInteger(duration)) return
                      if (duration === 0) return

                      setDuration(duration - 1)
                    }}
                    isRequired
                  />
                </span>
              </Flex.Item>
              <Flex.Item padding="small">
                <CheckboxGroup
                  name="options"
                  onChange={value => {
                    setOptions(value)
                  }}
                  defaultValue={options}
                  description={I18n.t('Options')}
                >
                  <Checkbox
                    label={I18n.t('Enable recording for this conference')}
                    value="recording_enabled"
                  />
                  <Checkbox
                    label={I18n.t('No time limit (for long-running conferences)')}
                    value="no_time_limit"
                  />
                  <Checkbox label={I18n.t('Enable waiting room')} value="enable_waiting_room" />
                  <Checkbox label={I18n.t('Add to Calendar')} value="add_to_calendar" />
                </CheckboxGroup>
              </Flex.Item>
              <Flex.Item padding="small">
                <TextArea
                  label={I18n.t('Description')}
                  placeholder={I18n.t('Conference Description')}
                  value={description}
                  onChange={e => {
                    setDescription(e.target.value)
                  }}
                />
              </Flex.Item>
            </Flex>
          </Tabs.Panel>
          <Tabs.Panel
            id={ATTENDEES_TAB}
            renderTitle={I18n.t('Attendees')}
            selected={tab === ATTENDEES_TAB}
          >
            <Flex margin="none none large" direction="column">
              <Flex.Item padding="small">
                <CheckboxGroup
                  name="invitation_options"
                  onChange={value => {
                    setInvitationOptions(value)
                  }}
                  defaultValue={invitationOptions}
                  description={I18n.t('Invitation Options')}
                >
                  <Checkbox label={I18n.t('Invite all course members')} value="invite_all" />
                  <Checkbox
                    label={I18n.t('Remove all course observer members')}
                    value="remove_observers"
                  />
                </CheckboxGroup>
              </Flex.Item>
              <Flex.Item padding="small">
                <CheckboxGroup
                  name="attendees_options"
                  onChange={value => {
                    setAttendeesOptions(value)
                  }}
                  defaultValue={attendeesOptions}
                  description={I18n.t('Allow Attendees To...')}
                >
                  <Checkbox label={I18n.t('Share webcam')} value="share_webcam" />
                  <Checkbox
                    label={I18n.t('See other viewers webcams')}
                    value="share_other_webcams"
                  />
                  <Checkbox label={I18n.t('Share microphone')} value="share_microphone" />
                  <Checkbox label={I18n.t('Send public chat messages')} value="send_public_chat" />
                  <Checkbox
                    label={I18n.t('Send private chat messages')}
                    value="send_private_chat"
                  />
                </CheckboxGroup>
              </Flex.Item>
            </Flex>
          </Tabs.Panel>
        </Tabs>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onDismiss} margin="0 x-small 0 0" data-testid="cancel-button">
          {I18n.t('Cancel')}
        </Button>
        <Button color="primary" type="submit" data-testid="submit-button">
          {isEditing ? I18n.t('Save') : I18n.t('Create')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

VideoConferenceModal.propTypes = {
  open: PropTypes.bool,
  onDismiss: PropTypes.func,
  onSubmit: PropTypes.func,
  isEditing: PropTypes.bool,
  name: PropTypes.string,
  duration: PropTypes.number,
  options: PropTypes.arrayOf(PropTypes.string),
  description: PropTypes.string,
  invitationOptions: PropTypes.arrayOf(PropTypes.string),
  attendeesOptions: PropTypes.arrayOf(PropTypes.string)
}

VideoConferenceModal.defaultProps = {
  isEditing: false
}

export default VideoConferenceModal
