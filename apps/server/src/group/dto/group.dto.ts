import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Group, GroupRole, GroupMembershipStatus } from '../../generated/prisma/client.js';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class GroupMemberReducedDTO {
  @ApiProperty()
  userId: string;

  @ApiProperty({ enum: GroupRole, enumName: 'GroupRole' })
  @IsEnum(GroupRole)
  role: GroupRole;

  @ApiProperty({ enum: GroupMembershipStatus, enumName: 'GroupMembershipStatus' })
  @IsEnum(GroupMembershipStatus)
  status: GroupMembershipStatus;
}
export class GroupDTO {
  @ApiProperty()
  id: ID;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiProperty()
  createdById: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  archivedAt?: Date | null;

  @ApiProperty({ type: GroupMemberReducedDTO, isArray: true, required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GroupMemberReducedDTO)
  members: GroupMemberReducedDTO[];

  constructor(group: Group & { memberships?: GroupMemberReducedDTO[] }) {
    Object.assign(this, group);
    this.members = group.memberships ?? [];
  }
}

export class CreateGroupDto {
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty()
  @IsString()
  name: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  description: string;

  @ApiProperty({ type: String, isArray: true, required: false })
  @IsOptional()
  @IsArray()
  members?: ID[];
}

export class UpdateGroupDto {
  @MaxLength(255)
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name: string | undefined;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description: string | undefined;
}

export class AddGroupMemberDto {
  @ApiProperty()
  @IsString()
  userId: ID;

  @ApiProperty({ enum: GroupRole, enumName: 'GroupRole', required: false })
  @IsOptional()
  @IsEnum(GroupRole)
  role?: GroupRole;
}

export class UpdateGroupMemberDto {
  @ApiProperty({ enum: GroupRole, enumName: 'GroupRole', required: false })
  @IsOptional()
  @IsEnum(GroupRole)
  role?: GroupRole;

  @ApiProperty({ enum: GroupMembershipStatus, enumName: 'GroupMembershipStatus', required: false })
  @IsOptional()
  @IsEnum(GroupMembershipStatus)
  status?: GroupMembershipStatus;
}
