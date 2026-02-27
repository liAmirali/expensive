import { GroupDTO } from '../dto/group.dto.js';

export class GroupPolicy {
  static canUpdate(userId: ID, group: GroupDTO) {
    return !!group.members.find((member) => member.userId === userId);
  }

  static canDelete(userId: ID, group: GroupDTO) {
    return !!group.members.find(
      (member) => member.userId === userId && member.role === 'OWNER',
    );
  }

  static canAddMember(userId: ID, group: GroupDTO) {
    return !!group.members.find((member) => member.userId === userId);
  }
}
