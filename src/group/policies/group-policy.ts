import { GroupDTO } from '../dto/group.dto';

export class GroupPolicy {
  static canUpdate(userId: ID, group: GroupDTO) {
    return !!group.members.find((member) => member.userId === userId);
  }
}
