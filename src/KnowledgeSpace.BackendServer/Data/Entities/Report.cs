﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using KnowledgeSpace.BackendServer.Data.Interfaces;

namespace KnowledgeSpace.BackendServer.Data.Entities;

[Table("Reports")]
public class Report : IDateTracking
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int KnowledgeBaseId { get; set; }

    [MaxLength(500)]
    public string Content { get; set; } = default!;

    [MaxLength(50)]
    [Column(TypeName = "varchar(50)")]
    public string ReportUserId { get; set; } = default!;

    public DateTime CreateDate { get; set; }
    public DateTime? LastModifiedDate { get; set; }

    public bool IsProcessed { get; set; }
}