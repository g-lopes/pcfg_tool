import {Hook} from '@oclif/config'

const hook: Hook<'command_not_found'> = async function (_opts) {
  console.log('Command not found. Exiting with code 22 😔')
  this.exit(22)
}

export default hook
