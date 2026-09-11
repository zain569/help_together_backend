import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum compainStatus {
    Active = 'active',
    Completed = 'completed',
    Closed = 'close'
}

@Entity('campaigns')
export class CampaignEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({type: 'text'})
    description: string;

    @Column({type: "decimal", precision: 12, scale:2})
    goalAmount: number;

    @Column({type: "decimal", precision: 12, scale:2, default: 0})
    collectedAmount: number;

    @Column({default: 0})
    remainingAmount: number;

    @Column({nullable: true})
    image: string;

    @Column({
        type: 'enum',
        enum: compainStatus,
        default: compainStatus.Active
    })
    status: compainStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedDate:  Date;
}