import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { DonationEntity } from "../../donation/entities/donation.entity.js";
import type { Relation } from "typeorm";

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

    @Column({ type: "decimal", precision: 12, scale: 2 })
    goalAmount: number;

    @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
    collectedAmount: number;

    @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
    remainingAmount: number;

    @OneToMany(() => DonationEntity, (donation) => donation.campaign)
    donations: Relation<DonationEntity>;

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