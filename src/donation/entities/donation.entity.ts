import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import type { Relation } from "typeorm";
import { User } from "../../user/user.entity.js";
import { CampaignEntity } from "../../campaigns/entities/campaign.entity.js";

@Entity('donation')
export class DonationEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: "decimal", precision: 12, scale: 2 })
    amount: number;

    @ManyToOne(() => User, (user) => user.donations)
    user: Relation<User>;

    @ManyToOne(() => CampaignEntity, (campaigns) => campaigns.donations)
    campaign: Relation<CampaignEntity>;

    @Column()
    paymentStatus: string;

    @Column()
    paymentMethod: string;

    @CreateDateColumn()
    createdAt: Date;
}